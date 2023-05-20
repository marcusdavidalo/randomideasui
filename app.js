document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const displayNameInput = document.getElementById('displayNameInput');
  const saveDisplayNameBtn = document.getElementById('saveDisplayNameBtn');
  const navbar = document.getElementById('navbar');
  const generatorTab = document.getElementById('generatorTab');
  const addIdeaTab = document.getElementById('addIdeaTab');
  const myIdeasTab = document.getElementById('myIdeasTab');
  const generatorContent = document.getElementById('generatorContent');
  const addIdeaContent = document.getElementById('addIdeaContent');
  const myIdeasContent = document.getElementById('myIdeasContent');
  const generateBtn = document.getElementById('generateBtn');
  const ideaContainer = document.getElementById('ideaContainer');
  const userContainer = document.getElementById('userContainer');
  const tagContainer = document.getElementById('tagContainer');
  const dateContainer = document.getElementById('dateContainer');
  const ideaInput = document.getElementById('ideaInput');
  const tagInput = document.getElementById('tagInput');
  const submitIdeaBtn = document.getElementById('submitIdeaBtn');
  const myIdeaList = document.getElementById('myIdeaList');
  const allIdeasList = document.getElementById('allIdeasList');
  const loadingScreen = document.getElementById('loadingScreen');

  // Define a mapping of tags to colors
  const tagColors = {
    technology: 'bg-blue-500',
    art: 'bg-red-500',
    food: 'bg-yellow-500',
    travel: 'bg-green-500',
    sports: 'bg-purple-500',
    music: 'bg-pink-500',
    fashion: 'bg-gray-500',
    books: 'bg-indigo-500',
    gaming: 'bg-orange-500',
    health: 'bg-teal-500',
    fitness: 'bg-lime-500',
    photography: 'bg-cyan-500',
    science: 'bg-amber-500',
    nature: 'bg-emerald-500',
    education: 'bg-red-600',
    business: 'bg-orange-600',
    finance: 'bg-lime-600',
    humor: 'bg-pink-600',
    history: 'bg-cyan-600',
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

  // Fetch random idea from the server
  // Fetch random idea from the server
  async function fetchRandomIdea() {
    try {
      const response = await axios.get('http://localhost:8000/api/ideas');
      const ideas = response.data.data;
      const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];

      ideaContainer.innerHTML = `
      <p class="bg-gray-800 px-4 py-4 rounded">${randomIdea.text}</p>
      <div class="flex mb-20 mt-2">
        <p class="text-2xl px-4 py-4 rounded bg-amber-600">by: ${
          randomIdea.username
        }</p>
        <p class="ml-2 text-2xl px-4 py-4 rounded ${
          tagColors[randomIdea.tag]
        }">${randomIdea.tag}</p>
        <p class="ml-2 text-2xl px-4 py-4 rounded bg-gray-800">${randomIdea.date.slice(
          0,
          10
        )}</p>
    </div>
    `;
    } catch (error) {
      console.error(error);
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
          <li class="px-4 py-3 rounded bg-gray-800 my-2">
          <div class="flex justify-between">
            <span class="justify-between text-xl my-2 px-2 py-1 rounded bg-gray-700">${
              idea.text
            }</span>
            <button class="delete-btn bg-red-500 hover:bg-red-700 ml-2 px-2 py-1 rounded" data-idea-id="${
              idea._id
            }">Delete</button>
            </div>
            <div class="flex my-2">
              <span class="bg-amber-600 px-2 py-1 rounded">by: ${
                idea.username
              }</span>
              <span class="${
                tagColors[idea.tag]
              } ml-2 px-2 py-1 rounded">tag: ${idea.tag}</span>
            </div>
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

  // Fetch and display all ideas - no delete button
  async function fetchAllIdeas() {
    try {
      showLoadingScreen();
      const response = await axios.get('http://localhost:8000/api/ideas');
      const ideas = response.data.data;
      allIdeasList.innerHTML = '';

      ideas.forEach((idea) => {
        const listItem = `
        <li class="px-4 py-3 rounded bg-gray-800 my-2">
            <span class="justify-between text-xl my-2 px-2 py-1 rounded bg-gray-700">${
              idea.text
            }</span>
            <div class="flex my-2">
              <span class="bg-amber-600 px-2 py-1 rounded">by: ${
                idea.username
              }</span>
              <span class="${
                tagColors[idea.tag]
              } ml-2 px-2 py-1 rounded">tag: ${idea.tag}</span>
            </div>
          </li>
      `;

        allIdeasList.innerHTML += listItem;
      });
      hideLoadingScreen();
    } catch (error) {
      console.error(error);
      hideLoadingScreen();
    }
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
    }
  });
  // Generate random idea
  generateBtn.addEventListener('click', fetchRandomIdea);

  // Submit new idea
  submitIdeaBtn.addEventListener('click', submitIdea);

  // Change user
  const changeUserBtn = document.getElementById('changeUserBtn');
  changeUserBtn.addEventListener('click', promptDisplayName);

  // Check if display name exists in local storage
  if (localStorage.getItem('displayName')) {
    displayName = localStorage.getItem('displayName');
    isModalVisible = false;
    modal.classList.add('hidden');
  } else {
    promptDisplayName();
  }

  showLoadingScreen(); // Show loading screen on app initialization
  fetchMyIdeas().then(() => {
    fetchAllIdeas(); // Fetch all ideas after my ideas are fetched
    hideLoadingScreen(); // Hide loading screen when all data is fetched
  });
});
