const fs = require('fs');
const path = require('path');

async function main() {
  const imageBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAIAAeIhvAAAAAElFTkSuQmCC',
    'base64'
  );

  const formData = new FormData();
  formData.append('name', 'Demo Category');
  formData.append('image', new Blob([imageBuffer], { type: 'image/png' }), 'test-image.png');

  const response = await fetch('http://localhost:5000/api/categories', {
    method: 'POST',
    body: formData,
  });

  const text = await response.text();
  console.log(response.status);
  console.log(text);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});