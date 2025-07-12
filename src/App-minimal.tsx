import React from 'react';

const App = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🎉 Землемер работает!</h1>
      <p>Приложение успешно загружено</p>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => alert('GPS функции будут здесь!')}>
          GPS Маркеры
        </button>
      </div>
    </div>
  );
};

export default App;
