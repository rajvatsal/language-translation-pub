const translate = (function() {
  const googleAPI = (() => {
    const _API_KEY =  window.config.API_KEY;
    async function getTranslation(text, lang) {
      const res = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${_API_KEY}`,
        { q: text, target: lang }
      );
      const translation = res.data.data.translations[0].translatedText;
      return translation;
    }
    return {getTranslation};
  })();

  const initTranslationService = (() => {
    const {getTranslation} = googleAPI;
    const inputBox = document.getElementById('input');
    const _getLang = () =>  document.getElementById('lang').options[document.getElementById('lang').selectedIndex].value;
    const displayTranslation = async () => {
      inputBox.value = await getTranslation(inputBox.value, _getLang());
    }
    inputBox.addEventListener('keydown', async (e) => {
      if(e.code !== 'Space') return
      const input = inputBox.value.split(" ");
      const translatedText = await getTranslation(input.slice(-1), _getLang());
      input.splice(input.length - 1, 1, translatedText);
      inputBox.value = `${input.join(' ')} `;
    });
    return {inputBox, displayTranslation};
  })();

  const translateButton = (() => {
    const {displayTranslation} = initTranslationService;
    const _translateBtn = document.getElementById('translateBtn');
    _translateBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      displayTranslation();
    });
  })();

  const copyButton = (() => {
    const {inputBox} = initTranslationService;
    const _cpyBtn = document.getElementById('copy');
    _cpyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(`${inputBox.value}`);
        alert('Copied To Clipboard');
      } catch(err) {
        console.error('Failed To Copy: ', err);
      }
    });
  })();
})();
