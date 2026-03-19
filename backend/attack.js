async function attack() {
    console.log("Iniciando ataque de fuerza bruta...");
    for (let i = 0; i < 100; i++) {
  fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ test: true })
  })
    .then(r => {
      console.log("Status:", r.status);
      console.log("Cabeceras:", r.headers);
    })
    .catch(e => console.error("Error:", e));  }
  }
  attack();
  