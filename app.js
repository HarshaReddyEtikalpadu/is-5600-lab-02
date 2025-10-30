// Wait for DOM to load before executing code
document.addEventListener('DOMContentLoaded', () => {
  // Parse JSON data from included script files
  const stocksData = JSON.parse(stockContent);
  const userData = JSON.parse(userContent);

  // Get references to buttons
  const saveButton = document.querySelector('#btnSave');
  const deleteButton = document.querySelector('#btnDelete');

  // Initialize the user list on page load
  generateUserList(userData, stocksData);

  // Register the event listener on the save button
  saveButton.addEventListener('click', (event) => {
    // Prevent form submission
    event.preventDefault();

    // Get the user ID from the form
    const id = document.querySelector('#userID').value;

    // Find and update the user in the userData array
    for (let i = 0; i < userData.length; i++) {
      if (userData[i].id == id) {
        // Update user information
        userData[i].user.firstname = document.querySelector('#firstname').value;
        userData[i].user.lastname = document.querySelector('#lastname').value;
        userData[i].user.address = document.querySelector('#address').value;
        userData[i].user.city = document.querySelector('#city').value;
        userData[i].user.email = document.querySelector('#email').value;

        // Regenerate the user list to reflect changes
        generateUserList(userData, stocksData);
        break;
      }
    }
  });

  // Register the event listener on the delete button
  deleteButton.addEventListener('click', (event) => {
    // Prevent form submission
    event.preventDefault();

    // Get the user ID and find the user's index
    const userId = document.querySelector('#userID').value;
    const userIndex = userData.findIndex(user => user.id == userId);

    // Remove the user from the array
    if (userIndex !== -1) {
      userData.splice(userIndex, 1);
      
      // Clear the form
      document.querySelector('#userID').value = '';
      document.querySelector('#firstname').value = '';
      document.querySelector('#lastname').value = '';
      document.querySelector('#address').value = '';
      document.querySelector('#city').value = '';
      document.querySelector('#email').value = '';
      
      // Clear portfolio and stock info
      document.querySelector('.portfolio-list').innerHTML = '';
      document.querySelector('#stockName').textContent = '';
      document.querySelector('#stockSector').textContent = '';
      document.querySelector('#stockIndustry').textContent = '';
      document.querySelector('#stockAddress').textContent = '';
      document.querySelector('#logo').src = '';
      
      // Regenerate the user list
      generateUserList(userData, stocksData);
    }
  });
});

/**
 * Loops through the users and renders a ul with li elements for each user
 * @param {Array} users - Array of user objects
 * @param {Array} stocks - Array of stock objects
 */
function generateUserList(users, stocks) {
  // Get the list element
  const userList = document.querySelector('.user-list');
  
  // Clear out the list from previous render
  userList.innerHTML = '';
  
  // Create a list item for each user
  users.map(({ user, id }) => {
    const listItem = document.createElement('li');
    listItem.innerText = user.lastname + ', ' + user.firstname;
    listItem.setAttribute('id', id);
    userList.appendChild(listItem);
  });

  // Register the event listener on the list using event delegation
  userList.addEventListener('click', (event) => handleUserListClick(event, users, stocks));
}

/**
 * Handles the click event on the user list
 * @param {Event} event - Click event
 * @param {Array} users - Array of user objects
 * @param {Array} stocks - Array of stock objects
 */
function handleUserListClick(event, users, stocks) {
  // Get the user id from the list item
  const userId = event.target.id;
  
  // Find the user in the userData array
  const user = users.find(user => user.id == userId);
  
  // Only proceed if a user was found
  if (user) {
    // Populate the form with the user's data
    populateForm(user);
    
    // Render the portfolio items for the user
    renderPortfolio(user, stocks);
  }
}

/**
 * Populates the form with the user's data
 * @param {Object} data - User data object
 */
function populateForm(data) {
  // Destructure to get the user and id from the data object
  const { user, id } = data;
  
  // Populate form fields
  document.querySelector('#userID').value = id;
  document.querySelector('#firstname').value = user.firstname;
  document.querySelector('#lastname').value = user.lastname;
  document.querySelector('#address').value = user.address;
  document.querySelector('#city').value = user.city;
  document.querySelector('#email').value = user.email;
}

/**
 * Renders the portfolio items for the user
 * @param {Object} user - User object with portfolio
 * @param {Array} stocks - Array of stock objects
 */
function renderPortfolio(user, stocks) {
  // Get the user's stock data
  const { portfolio } = user;
  
  // Get the portfolio list element
  const portfolioDetails = document.querySelector('.portfolio-list');
  
  // Clear the list from previous render
  portfolioDetails.innerHTML = '';
  
  // Map over portfolio items and render them
  portfolio.map(({ symbol, owned }) => {
    // Create elements for each portfolio item
    const symbolEl = document.createElement('p');
    const sharesEl = document.createElement('p');
    const actionEl = document.createElement('button');
    
    symbolEl.innerText = symbol;
    sharesEl.innerText = owned;
    actionEl.innerText = 'View';
    actionEl.setAttribute('id', symbol);
    
    // Append elements to the portfolio list
    portfolioDetails.appendChild(symbolEl);
    portfolioDetails.appendChild(sharesEl);
    portfolioDetails.appendChild(actionEl);
  });

  // Register the event listener on the portfolio list using event delegation
  portfolioDetails.addEventListener('click', (event) => {
    // Only handle clicks on buttons
    if (event.target.tagName === 'BUTTON') {
      viewStock(event.target.id, stocks);
    }
  });
}

/**
 * Renders the stock information for the symbol
 * @param {string} symbol - Stock symbol
 * @param {Array} stocks - Array of stock objects
 */
function viewStock(symbol, stocks) {
  // Get the stock area element
  const stockArea = document.querySelector('.stock-form');
  
  if (stockArea) {
    // Find the stock object for this symbol
    const stock = stocks.find(function (s) { 
      return s.symbol == symbol;
    });

    // Populate stock information if found
    if (stock) {
      document.querySelector('#stockName').textContent = stock.name;
      document.querySelector('#stockSector').textContent = stock.sector;
      document.querySelector('#stockIndustry').textContent = stock.subIndustry;
      document.querySelector('#stockAddress').textContent = stock.address;
      document.querySelector('#logo').src = `logos/${symbol}.svg`;
    }
  }
}