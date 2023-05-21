document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const displayNameInput = document.getElementById('displayNameInput');
  const saveDisplayNameBtn = document.getElementById('saveDisplayNameBtn');
  const closeDisplayNameBtn = document.getElementById('closeDisplayNameBtn');
  const generatorTab = document.getElementById('generatorTab');
  const tagSelect = document.getElementById('tagSelect');
  const addIdeaTab = document.getElementById('addIdeaTab');
  const myIdeasTab = document.getElementById('myIdeasTab');
  const generatorContent = document.getElementById('generatorContent');
  const addIdeaContent = document.getElementById('addIdeaContent');
  const myIdeasContent = document.getElementById('myIdeasContent');
  const generateBtn = document.getElementById('generateBtn');
  const ideaContainer = document.getElementById('ideaContainer');
  const tagFilterSelect = document.getElementById('tagFilter');
  const nameFilterInput = document.getElementById('nameFilter');
  const ideaInput = document.getElementById('ideaInput');
  const tagInput = document.getElementById('tagInput');
  const submitIdeaBtn = document.getElementById('submitIdeaBtn');
  const myIdeaList = document.getElementById('myIdeaList');
  const allIdeasList = document.getElementById('allIdeasList');
  const loadingScreen = document.getElementById('loadingScreen');
  const itemsPerPage = 9;
  let currentPage = 1;
  let filteredIdeas = [];

  // Define a mapping of tags to colors
  const tagColors = {
    technology: 'bg-gradient-to-br from-blue-800 to-violet-600',
    art: 'bg-gradient-to-br from-red-600 to-yellow-600',
    food: 'bg-gradient-to-br from-red-700 to-pink-600',
    travel: 'bg-gradient-to-br from-green-600 to-blue-600',
    sports: 'bg-gradient-to-br from-green-600 to-red-600 to-yellow-600',
    music: 'bg-gradient-to-br from-pink-500 to-purple-500',
    fashion: 'bg-gradient-to-br from-purple-500 to-cyan-500',
    books: 'bg-gradient-to-br from-indigo-500 to-teal-500',
    movies: 'bg-gradient-to-br from-gray-800 from-75% via-gray-500',
    gaming: 'bg-gradient-to-br from-orange-500 to-yellow-500',
    health: 'bg-gradient-to-br from-teal-500 to-green-500',
    fitness: 'bg-gradient-to-br from-lime-500 to-yellow-500',
    photography: 'bg-gradient-to-br from-cyan-500 to-blue-500',
    science: 'bg-gradient-to-br from-amber-500 to-yellow-500',
    nature: 'bg-gradient-to-br from-green-700 to-emerald-950',
    education: 'bg-gradient-to-br from-red-600 to-orange-600',
    business: 'bg-gradient-to-br from-orange-600 to-yellow-600',
    finance: 'bg-gradient-to-br from-lime-600 to-yellow-600',
    humor: 'bg-gradient-to-br from-pink-600 to-purple-600',
    history: 'bg-gradient-to-br from-cyan-600 to-blue-600',
  };

  let displayName = null;
  let isModalVisible = true;

  // Show the loading screen
  function showLoadingScreen() {
    loadingScreen.classList.remove('hidden');
  }

  // Hide the loading screen
  function hideLoadingScreen() {
    loadingScreen.classList.add('hidden');
  }

  // Prompt user for Display Name
  function promptDisplayName() {
    modal.classList.remove('hidden');
  }

  // Save Display Name
  function saveDisplayName() {
    displayName = displayNameInput.value.trim();
    if (displayName !== '') {
      modal.classList.add('hidden');
      isModalVisible = false;
      localStorage.setItem('displayName', displayName); // Store display name in local storage
      document.getElementById(
        'currentUser'
      ).innerHTML = `<p>User: ${displayName}`; // Update the current user element
      showTabContent(generatorContent);
    }
  }

  // Show tab content based on the clicked tab
  function showTabContent(tabContent) {
    if (!isModalVisible) {
      generatorContent.classList.add('hidden');
      addIdeaContent.classList.add('hidden');
      myIdeasContent.classList.add('hidden');
      allIdeasContent.classList.add('hidden');
      tabContent.classList.remove('hidden');
    }
  }

  // Fetch random idea from the server with tag filter
  async function fetchRandomIdea() {
    try {
      const tagFilterRandom = tagSelect.value; // Get the selected tag filter value
      const response = await axios.get('http://localhost:8000/api/ideas');
      const ideas = response.data.data;

      // Filter ideas based on tag filter
      const filteredIdeas =
        tagFilterRandom !== 'all'
          ? ideas.filter((idea) => idea.tag === tagFilterRandom)
          : ideas;

      if (filteredIdeas.length > 0) {
        const randomIdea =
          filteredIdeas[Math.floor(Math.random() * filteredIdeas.length)];
        ideaContainer.innerHTML = `
          <p class="px-4 py-4 rounded-md frosted-dark">${randomIdea.text}</p>
          <div class="flex mb-20 mt-2">
            <p class="text-2xl px-4 py-4 rounded-md bg-amber-600">by: ${
              randomIdea.username
            }</p>
            <p class="ml-2 text-2xl px-4 py-4 rounded-md ${
              tagColors[randomIdea.tag]
            }">${randomIdea.tag}</p>
            <p class="ml-2 text-2xl px-4 py-4 rounded-md frosted-dark">${randomIdea.date.slice(
              0,
              10
            )}</p>
          </div>
        `;
      } else {
        ideaContainer.innerHTML = `<p>No ideas found with the selected tag.</p>`;
      }
      hideLoadingScreen();
    } catch (error) {
      console.error(error);
      ideaContainer.innerHTML = `<p>Error occurred while fetching ideas.</p>`;
      hideLoadingScreen();
    }
  }

  // Delete an idea from the server
  async function deleteIdea(ideaId) {
    try {
      await axios.delete(`http://localhost:8000/api/ideas/${ideaId}`);
      fetchMyIdeas(); // Refresh the list of ideas
    } catch (error) {
      console.error(error);
    }
  }

  // Attach event listeners to delete buttons
  function attachDeleteButtonListeners() {
    const deleteButtons = document.getElementsByClassName('delete-btn');
    for (let i = 0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener('click', function () {
        const ideaId = this.dataset.ideaId;
        deleteIdea(ideaId);
      });
    }
  }

  // Fetch and display user's submitted ideas
  async function fetchMyIdeas() {
    try {
      showLoadingScreen();
      const response = await axios.get('http://localhost:8000/api/ideas');
      const ideas = response.data.data;
      const myIdeas = ideas.filter((idea) => idea.username === displayName);
      myIdeaList.innerHTML = '';
      myIdeas.forEach((idea) => {
        const listItem = `
          <li class="px-4 py-3 rounded-md frosted-blur">
          <div class="flex justify-between rounded-md frosted-dark">
            <span class="justify-between text-xl my-2 px-2 py-1 rounded-md">${
              idea.text
            }</span>
            </div>
            <div class="flex my-2">
            <span class="bg-amber-600 px-2 py-1 rounded-md">by: ${
              idea.username
            }</span>
            <span class="${
              tagColors[idea.tag]
            } ml-2 px-2 py-1 rounded-md">tag: ${idea.tag}</span>
            </div>
            <button class="w-full delete-btn px-2 py-1 rounded-md frosted-delete" data-idea-id="${
              idea._id
            }">Delete</button>
          </li>
        `;
        myIdeaList.innerHTML += listItem;
      });

      attachDeleteButtonListeners(); // Attach event listeners to delete buttons
      hideLoadingScreen();
    } catch (error) {
      console.error(error);
      hideLoadingScreen();
    }
  }

  // Fetch and display all ideas NOW with pagination - :)
  async function fetchAllIdeas() {
    try {
      showLoadingScreen();
      const response = await axios.get('http://localhost:8000/api/ideas');
      const ideas = response.data.data;
      const tagFilter = tagFilterSelect.value; // Get the selected tag filter value

      // Filter ideas based on tag filter
      filteredIdeas =
        tagFilter !== ''
          ? ideas.filter((idea) => idea.tag === tagFilter)
          : ideas;

      // Apply name filter if available
      const nameFilter = nameFilterInput.value.trim().toLowerCase();
      if (nameFilter !== '') {
        filteredIdeas = filteredIdeas.filter((idea) =>
          idea.username.toLowerCase().includes(nameFilter)
        );
      }

      // Calculate total number of pages
      const totalPages = Math.ceil(filteredIdeas.length / itemsPerPage);

      // Validate current page number
      if (currentPage < 1) {
        currentPage = 1;
      } else if (currentPage > totalPages) {
        currentPage = totalPages;
      }

      // Calculate start and end indices of ideas for the current page
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      // Display ideas for the current page
      const currentPageIdeas = filteredIdeas.slice(startIndex, endIndex);
      displayIdeas(currentPageIdeas);

      // Generate pagination buttons
      generatePaginationButtons(totalPages);

      hideLoadingScreen();
    } catch (error) {
      console.error(error);
      hideLoadingScreen();
    }
  }

  // Display the ideas on the page
  function displayIdeas(ideas) {
    const list = document.getElementById('allIdeasList');
    list.innerHTML = '';
    ideas.forEach((idea) => {
      const listItem = `
        <li class="px-4 py-3 rounded-md frosted-blur">
          <div class="p-2 rounded-md frosted-dark">
            <span class="justify-between text-xl rounded-md">${idea.text}</span>
          </div>
          <div class="flex my-2">
            <span class="bg-amber-600 px-2 py-1 rounded-md">by: ${
              idea.username
            }</span>
            <span class="${
              tagColors[idea.tag]
            } ml-2 px-2 py-1 rounded-md">tag: ${idea.tag}</span>
          </div>
        </li>
      `;
      list.innerHTML += listItem;
    });
  }

  // Generate pagination buttons
  function generatePaginationButtons(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.classList.add(
        'ml-2',
        'px-4',
        'py-4',
        'rounded-md',
        'frosted-blur'
      );

      if (i === currentPage) {
        button.classList.add('frosted-dark', 'text-white');
      } else {
        button.addEventListener('click', () => {
          currentPage = i;
          fetchAllIdeas();
        });
      }

      paginationContainer.appendChild(button);
    }
  }

  // Filter ideas by name
  function filterIdeasByName() {
    const nameFilter = nameFilterInput.value.trim().toLowerCase();
    const ideas = Array.from(allIdeasList.children);

    ideas.forEach((idea) => {
      const username = idea
        .querySelector('.bg-amber-600')
        .textContent.toLowerCase();

      if (username.includes(nameFilter) || nameFilter === '') {
        idea.style.display = 'block';
      } else {
        idea.style.display = 'none';
      }
    });
  }

  // Submit new idea to the server
  async function submitIdea() {
    const idea = ideaInput.value.trim();
    const tag = tagInput.value.trim();

    if (idea !== '' && tag !== 'tagselect') {
      try {
        const response = await axios.post('http://localhost:8000/api/ideas', {
          text: idea,
          tag,
          username: displayName,
        });
        const newIdea = response.data.data;
        ideaInput.value = '';
        tagInput.value = '';
        fetchMyIdeas(); // Refresh the list of ideas
        fetchAllIdeas(); // Refresh the list of ideas
      } catch (error) {
        console.error(error);
      }
    }
  }

  // Event Listeners
  saveDisplayNameBtn.addEventListener('click', saveDisplayName);
  generatorTab.addEventListener('click', () =>
    showTabContent(generatorContent)
  );

  closeDisplayNameBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    isModalVisible = false;
  });

  // Show add idea tab
  addIdeaTab.addEventListener('click', () => showTabContent(addIdeaContent));

  // Show my ideas
  myIdeasTab.addEventListener('click', () => {
    if (!isModalVisible) {
      fetchMyIdeas();
      showTabContent(myIdeasContent);
    }
  });

  // Show all ideas
  allIdeasTab.addEventListener('click', () => {
    if (!isModalVisible) {
      fetchAllIdeas();
      showTabContent(allIdeasContent);
      tagFilterSelect.addEventListener('change', fetchAllIdeas);
      nameFilterInput.addEventListener('input', filterIdeasByName);
    }
  });

  // If on all ideas tab run fetchAllIdeas on enter keypress
  nameFilterInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      fetchAllIdeas();
    }
  });

  // Generate random idea
  generateBtn.addEventListener('click', fetchRandomIdea);

  // Submit new idea
  submitIdeaBtn.addEventListener('click', submitIdea);

  // Change user
  const changeUserBtn = document.getElementById('changeUserBtn');
  changeUserBtn.addEventListener('click', promptDisplayName);

  if (localStorage.getItem('displayName')) {
    displayName = localStorage.getItem('displayName');
    isModalVisible = false;
    modal.classList.add('hidden');
    document.getElementById(
      'currentUser'
    ).innerHTML = `<p>User: ${displayName}`; // Update the current user element
  } else {
    promptDisplayName();
  }

  showLoadingScreen(); // Show loading screen on app initialization
  fetchMyIdeas().then(() => {
    fetchAllIdeas(); // Fetch all ideas after my ideas are fetched
    hideLoadingScreen(); // Hide loading screen when all data is fetched
  });
});

// Hide navbar on scroll down and show on scroll up smoothly
let prevScrollPos = window.pageYOffset;
window.onscroll = function () {
  const currentScrollPos = window.pageYOffset;
  if (prevScrollPos > currentScrollPos) {
    document.getElementById('navbar').style.top = '0';
  } else {
    document.getElementById('navbar').style.top = '-100px';
  }
  prevScrollPos = currentScrollPos;
};

// Function to change the background to a darkened pixel art GIF based on the time of day
function changeBackgroundBasedOnTime() {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  document.addEventListener('mousemove', (event) => {
    const bggif = document.getElementById('backgroundGifContainer');

    // Calculate the new background position based on the mouse coordinates
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const offsetX = mouseX / bggif.offsetWidth;
    const offsetY = mouseY / bggif.offsetHeight;

    // Update the background position using CSS transform property
    bggif.style.transform = `translate(-${offsetX * 30}px, -${offsetY * 30}px)`;
  }); // Very bad for performance :(

  // Define the URLs of the pixel art GIFs for different times of day
  const backgroundGifs = {
    morning: 'url(https://media.tenor.com/RRhijk6pHAoAAAAC/good-morning.gif)',
    afternoon:
      'url(https://64.media.tumblr.com/d216cb89703e2eef4191146b2ef6f34a/tumblr_prjou88Lvu1soktugo1_1280.gif)',
    evening:
      'url(https://64.media.tumblr.com/141a1667d0345d9f898a0389761cde17/f540a8cc0997a926-41/s1280x1920/ec704b6dbec3dbd020566385f8766469c37a5b64.gif)',
    night:
      'url(https://media.tenor.com/TIUfh_o9hIUAAAAC/minimoss-pixel-art.gif)',
  };

  // Set the background image based on the current time of day
  if (currentHour >= 5 && currentHour < 12) {
    document.getElementById('backgroundGif').style.backgroundImage =
      backgroundGifs.morning; // in 12 hour format = 5am to 12pm
  } else if (currentHour >= 12 && currentHour < 18) {
    document.getElementById('backgroundGif').style.backgroundImage =
      backgroundGifs.afternoon; // in 12 hour format = 12pm to 6pm
  } else if (currentHour >= 18 && currentHour < 22) {
    document.getElementById('backgroundGif').style.backgroundImage =
      backgroundGifs.evening; // in 12 hour format = 6pm to 10pm
  } else {
    document.getElementById('backgroundGif').style.backgroundImage =
      backgroundGifs.night; // in 12 hour format = 10pm to 5am
  }
}

// Call the function to change the background based on the current time
changeBackgroundBasedOnTime();
