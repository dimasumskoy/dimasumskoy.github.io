const wordTimeStamp = /<.([0-1]?[0-9]|2[0-3]):[0-5][0-9].[0-9][0-9]>/g;

function lrcParser(data) {
  let lines = data.split('\n');
  const timeStart = /\[(\d*\:\d*\.?\d*)\]/;
  const scriptText = /(.+)/;
  const timeEnd = timeStart;
  const startAndText = new RegExp(timeStart.source + scriptText.source);

  const scripts = [];
  const result = {};
  const qualified = new RegExp(startAndText.source + '|' + timeEnd.source);

  lines = lines.filter(line => qualified.test(line));
  lines.forEach(function (line, index, arr) {
    const matches = startAndText.exec(line);
    const timeEndMatches = timeEnd.exec(arr[index + 1]);

    if (matches && timeEndMatches) {
      const [, start, text] = matches;
      const [, end] = timeEndMatches;
      const parsedText = text.replace(wordTimeStamp, '');
      const textTimeStamps = [];

      text.match(wordTimeStamp).forEach(timeStamp => {
        textTimeStamps.push(convertTime(timeStamp.replace(/<|>/g, '')));
      });

      let audioData = {
        start: convertTime(start),
        text: text,
        parsedText: parsedText,
        end: convertTime(end),
        wordTimeStamps: textTimeStamps
      }
      
      audioData.parsedWords = convertWords(audioData);;
      scripts.push(audioData);
    }
  });

  result.scripts = scripts;
  return result
}

function convertWords(audioData) {
  let start = audioData.start;
  let text = audioData.text;
  let timeStamps = audioData.wordTimeStamps;
  let words = text.split(wordTimeStamp).filter(elem => elem !== '0');
  let result = [];

  words.forEach(function(word, index, arr) {
    let parsedWord = {};

    parsedWord.start = index == 0 ? start : timeStamps[index - 1];
    parsedWord.end = timeStamps[index];
    parsedWord.part = word;

    result.push(parsedWord);
  });

  return result;
}

function convertTime(string) {
  string = string.split(':');

  const minutes = parseInt(string[0], 10);
  const seconds = parseFloat(string[1]);

  if (minutes > 0) {
    const sc = minutes * 60 + seconds;
    return parseFloat(sc.toFixed(2))
  }

  return seconds
}

$(function () {
  const player = document.getElementById('player');
  const textContainer = document.getElementById('audio_text');
  let audioText;

  document.getElementById('file').onchange = function () {
    const file = this.files[0];
    const fileReader = new FileReader();

    fileReader.addEventListener('load', e => {
      const data = e.target.result;
      const text = lrcParser(data);

      audioText = text.scripts;
      console.log(audioText);
    });

    fileReader.readAsText(file, 'Windows-1251');
  };

  player.addEventListener('timeupdate', function (e) {
    audioText.forEach(function (element, index, arr) {
      let last = index + 4;

      if (index !== last && index % 4 === 0) {
        let i = index;
        let parsedStrings = [];
        let rawStrings = [];

        while (i < last && i < arr.length) {
          parsedStrings.push(arr[i].parsedText);
          rawStrings.push(arr[i].text);

          i += 1;
        }

        if (player.currentTime >= element.start && player.currentTime <= element.end) {
          textContainer.innerHTML = '';

          parsedStrings.forEach(str => {
            let words = str.split(' ');

            words.forEach(function (word, index, arr) {
              let wrapper = document.createElement('span');
              wrapper.innerText = `${word} `;

              textContainer.appendChild(wrapper);

              if (index === arr.length - 1) {
                textContainer.appendChild(document.createElement('br'))
              }
            });
          });
        }
      }
    })
  })
});
