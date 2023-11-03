export default async function getPets() {
  return await fetch(
    'https://rolling-scopes-school.github.io/kostik-omsk-JSFE2023Q1/shelter/assets/js/pets.json'
  )
    .then((response) => response.json())
    .then((data) => {
      return [...data];
    })
    .catch((error) => console.error(error));
}
