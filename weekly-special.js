const weeklySpecial = document.createElement('template');
weeklySpecial.innerHTML = `
  <img class="special-photo" src="assets/hot-honey-chicken.webp" alt="Rootstock’s hot honey dipped chicken sandwich with shoestring fries" width="900" height="1200" loading="lazy">
  <h3>Hot Honey Dipped Chicken Sandwich</h3><p class="sub">Buttermilk chicken dipped in hot honey butter sauce, topped with sweet and tangy coleslaw on a brioche bun. Served with shoestring fries.</p>
`;

for (const card of document.querySelectorAll('[data-weekly-special]')) {
  const content = weeklySpecial.content.cloneNode(true);
  if (!card.hasAttribute('data-special-photo')) content.querySelector('img').remove();
  card.append(content);
}
