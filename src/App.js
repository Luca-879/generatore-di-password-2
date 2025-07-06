import React, { useState, useEffect } from 'react';
import PasswordStrengthBar from 'react-password-strength-bar';
import Modal from './Modal';

function App() {
  const [password, setPassword] = useState('');
  const [savedPasswords, setSavedPasswords] = useState([]);
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    let storedPasswords = JSON.parse(localStorage.getItem('passwords') || '[]');
    if (storedPasswords.length > 0 && typeof storedPasswords[0] === 'string') {
      storedPasswords = storedPasswords.map(p => ({ password: p, note: '' }));
      localStorage.setItem('passwords', JSON.stringify(storedPasswords));
    }
    setSavedPasswords(storedPasswords);
  }, []);

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let allChars = '';
    if (includeUppercase) allChars += uppercase;
    if (includeLowercase) allChars += lowercase;
    if (includeNumbers) allChars += numbers;
    if (includeSymbols) allChars += symbols;

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      generatedPassword += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    setPassword(generatedPassword);
  };

  const savePassword = () => {
    if (password && !savedPasswords.find(p => p.password === password)) {
      const newSavedPasswords = [...savedPasswords, { password: password, note: '' }];
      setSavedPasswords(newSavedPasswords);
      localStorage.setItem('passwords', JSON.stringify(newSavedPasswords));
    }
  };

  const deletePassword = (index) => {
    const newSavedPasswords = [...savedPasswords];
    newSavedPasswords.splice(index, 1);
    setSavedPasswords(newSavedPasswords);
    localStorage.setItem('passwords', JSON.stringify(newSavedPasswords));
  };

  const handleNoteChange = (index, note) => {
    const newSavedPasswords = [...savedPasswords];
    newSavedPasswords[index].note = note;
    setSavedPasswords(newSavedPasswords);
    localStorage.setItem('passwords', JSON.stringify(newSavedPasswords));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col items-center p-4 bg-cover bg-center font-sans" style={{backgroundImage: "url('/hero-bg.svg')"}}>
      {showNotification && (
        <div className="fixed top-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-bounce">
          Copiato negli appunti!
        </div>
      )}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">

        <header className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">Generatore di Password</h1>
          <p className="text-xl text-slate-400 mt-4">Crea password forti e sicure con un solo click.</p>
          <p className="text-lg text-slate-500 mt-2">Utilizza le opzioni qui sotto per personalizzare la lunghezza e i caratteri della tua password, quindi clicca su 'Genera Nuova' per crearne una.</p>
        </header>

        <main className="w-full flex flex-col items-center gap-8">
          <div className="w-full max-w-2xl flex flex-col gap-8">
            <div className="w-full max-w-2xl bg-slate-800/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700">
              <div className="flex flex-col sm:flex-row items-center bg-slate-900/80 rounded-lg p-4">
                <input type="text" className="w-full flex-grow bg-transparent text-3xl p-2 focus:outline-none tracking-wider font-mono text-cyan-300" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="P@$$w0rd..." />
                <button onClick={() => copyToClipboard(password)} className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-5 rounded-lg mt-4 sm:mt-0 sm:ml-4 transition-transform transform hover:scale-105 shadow-lg">Copia</button>
              </div>
              <div className="mt-5">
                <PasswordStrengthBar password={password} scoreWords={['troppo debole', 'debole', 'accettabile', 'buona', 'forte']} shortScoreWord="troppo corta" />
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-5 mt-8">
                <button onClick={generatePassword} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-xl text-lg">Genera Nuova</button>
                <button onClick={savePassword} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-xl text-lg">Salva</button>
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700">
              <h2 className="text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">Impostazioni</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="length" className="block mb-3 text-xl">Lunghezza: <span className="font-bold text-cyan-300">{length}</span></label>
                  <input type="range" className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" min="4" max="32" id="length" value={length} onChange={(e) => setLength(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 pt-4">
                  <div className="flex items-center">
                    <input className="w-6 h-6 text-cyan-600 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2" type="checkbox" checked={includeUppercase} onChange={() => setIncludeUppercase(!includeUppercase)} id="uppercase" />
                    <label className="ml-4 text-xl" htmlFor="uppercase">Maiuscole</label>
                  </div>
                  <div className="flex items-center">
                    <input className="w-6 h-6 text-cyan-600 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2" type="checkbox" checked={includeLowercase} onChange={() => setIncludeLowercase(!includeLowercase)} id="lowercase" />
                    <label className="ml-4 text-xl" htmlFor="lowercase">Minuscole</label>
                  </div>
                  <div className="flex items-center">
                    <input className="w-6 h-6 text-cyan-600 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2" type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} id="numbers" />
                    <label className="ml-4 text-xl" htmlFor="numbers">Numeri</label>
                  </div>
                  <div className="flex items-center">
                    <input className="w-6 h-6 text-cyan-600 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2" type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} id="symbols" />
                    <label className="ml-4 text-xl" htmlFor="symbols">Simboli</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700">
            <h2 className="text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">Password Salvate</h2>
            <ul className="space-y-5 max-h-[65vh] overflow-y-auto pr-3">
              {savedPasswords.map((p, index) => (
                <li key={index} className="bg-slate-900/80 p-5 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-700">
                  <div className="flex-grow w-full">
                    <code className="text-xl text-green-400 font-mono break-all">{p.password}</code>
                    <input
                      type="text"
                      className="bg-slate-700/70 text-white p-2 rounded-md w-full mt-3 text-base focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={p.note}
                      onChange={(e) => handleNoteChange(index, e.target.value)}
                      placeholder="Aggiungi una nota..."
                    />
                  </div>
                  <div className="flex items-center self-end sm:self-center mt-3 sm:mt-0">
                    <button className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 mr-3" onClick={() => copyToClipboard(p.password)}>Copia</button>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300" onClick={() => deletePassword(index)}>Elimina</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </main>

        <footer className="text-center py-10 text-slate-500">
          <div className="flex justify-center gap-6 mb-5">
            <button onClick={() => {
              setModalContent({ 
                title: 'Spiegazioni', 
                content: 'Questa applicazione genera password sicure in base alle tue preferenze. Le password generate e salvate vengono memorizzate esclusivamente sul tuo computer, utilizzando lo storage locale del browser. Questo significa che le tue password non vengono mai inviate o salvate sul mio server.'
              });
              setIsModalOpen(true);
            }} className="hover:text-cyan-400 transition-colors text-lg">Spiegazioni</button>
            <span className="text-slate-600">|</span>
            <button onClick={() => {
              setModalContent({ 
                title: 'Privacy Policy', 
                content: 'La tua privacy è importante. Le password che generi e salvi sono memorizzate solo nel tuo browser. Se cancelli i dati di navigazione (cookie e dati dei siti), le password salvate verranno eliminate in modo permanente. Non raccolgo né memorizzo alcuna informazione personale o password.'
              });
              setIsModalOpen(true);
            }} className="hover:text-cyan-400 transition-colors text-lg">Privacy Policy</button>
          </div>
          <p className="text-base">Creato con il ❤️ da Luca Difede</p>
        </footer>

      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalContent.title}>
        <p className="text-slate-300 text-lg">{modalContent.content}</p>
      </Modal>
    </div>
  );
}

export default App;