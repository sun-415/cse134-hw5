class ProjectCard extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){
        const imgSmall = this.getAttribute('img-small') || '';
        const imgMedium = this.getAttribute('img-medium') || '';
        const imgLarge = this.getAttribute('img-large') || '';
        const imgAlt = this.getAttribute('img-alt') !== "undefined" ? this.getAttribute('img-alt') : 'Unknown Alt text';
        const title = this.getAttribute('title') !== "undefined" ? this.getAttribute('title') : 'Untitled Project';
        const details = this.textContent.trim();
        const stack = this.getAttribute('stack') !== "undefined" ? this.getAttribute('stack') : 'Unknown Stack';
        const techList = stack.split(',').map(t => t.trim()).filter(t => t.length > 0);
        const source = this.getAttribute('source') || '#';

        // Clear any light DOM content before injecting template
        this.innerHTML = '';
        this.innerHTML += `
            <style>
                article.project-card {
                    background-color: var(--proj-card-bg, grey);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%; /* each <project-card> should fill its grid cell */

                    border-radius: 10%;
                    overflow: clip;

                    source, img {
                        width: 100%;
                        height: auto;
                        display: block;
                    }

                    h3, p, ul {
                        margin: 0.2rem 0.5rem;
                    }

                    h3 {
                        margin-top: 0.7rem;
                    }

                    ul {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 0.5rem;
                        margin-top: 0.3rem;

                        li {
                            background-color: var(--text-bubble, white);
                            border: 0.1px solid var(--text-bubble, white);
                            border-radius: 0.8rem;
                            padding: 0.1rem 0.3rem;
                            font-size: 0.7rem;
                        }
                    }

                    a, .coming-soon {
                        background-color: var(--text-bubble, white);
                        border: 0.1px solid var(--text-bubble, white);
                        border-radius: 0.4rem;
                        margin: 0.7rem 3rem 1.3rem;
                        padding: .4rem 0.3rem;
                        text-align: center;
                    }
                }
            </style>

            <article class="project-card">
                <picture>
                    <source srcset="${imgLarge}" media="(min-width: 800px)">
                    <source srcset="${imgMedium}" media="(min-width: 480px)">
                    <img src="${imgSmall}" alt="${imgAlt}" width="220" height="150">
                </picture>
                <h3>${title}</h3>
                <p>${details}</p>
                <ul>
                    ${techList.map(t => `<li><code>${t}</code></li>`).join('')}
                </ul>

                ${source !== '#' ? `<a href="${source}">Source</a>`: `<p class="coming-soon">Coming Soon</p>`}
            </article>
        `;

    }
}

// Register the custom element
customElements.define('project-card', ProjectCard);


const localKey = 'projectCardsLocal';
// JavaScript object literals of projectsso
const localProjectObjects = [
  {
    id: 'project1',
    title: 'Mood Garden',
    imgSmall: 'assets/fb-proj1.png',
    imgMedium: 'assets/proj1-2.png',
    imgLarge: 'assets/proj1.png',
    imgAlt: 'Mood Garden Project',
    stack: ['HTML', 'CSS', 'TypeScript', 'React'],
    details: 'Mood Garden is a wellness-focused web application designed to help users track their sleep and emotional well-being through a gamified experience. The app encourages users to build healthy habits by logging their daily sleep data and self-assessments, which contribute to their virtual garden’s growth. Note: this is fetching from localStorage.',
    source: 'https://github.com/sun-415/CSE-110-Project'
  },
  {
    id: 'project2',
    title: 'DBL Talks',
    imgSmall: 'assets/fb-proj2.png',
    imgMedium: 'assets/proj2-2.png',
    imgLarge: 'assets/proj2.png',
    imgAlt: 'DBL Talks Podcast Opening',
    stack: ['Synergy DBL', 'DaVinci Resolve'],
    details: 'This is the podcast of the multimodal educational materials for understanding Synergy DBL with Basic I/O and query selection on ISAM data, including updates/deletes and aggregation (COUNT/SUM/AVG). Authored scripts and live code to teach querying, sorting, grouping, and joining across files. Note: This is still work in progress so the source is not ready to be viewed yet. Note: this is fetching from localStorage.',
    source: null
  },
    {
    id: 'project3',
    title: 'Personal Portfolio',
    imgSmall: 'assets/fb-proj3.png',
    imgMedium: 'assets/proj3-2.png',
    imgLarge: 'assets/proj3.png',
    imgAlt: 'Personal Portfolio by Elaine',
    stack: ['Synergy DBL', 'DaVinci Resolve'],
    details: 'A responsive, accessibility-minded site built with semantic HTML and modern CSS (Flexbox/Grid, variables, custom fonts, media queries). It follows progressive enhancement and supports light/dark theming with system preference. Images are optimized and typography and spacing are tuned for readability across mobile, tablet, and desktop. Note: this is fetching from localStorage.',
    source: 'https://github.com/sun-415/cse134-hw5'
  }
];

// Convert JavaScript object into JSON string then store in local storage
localStorage.setItem(localKey, JSON.stringify(localProjectObjects));


// A shared function to dump an array of project objects into <project-card> elements
const cardsContainer = document.getElementById('project-cards');
function renderProjectCards(projects) {
  cardsContainer.innerHTML = ''; // clear current cards

  projects.forEach(p => {
    const card = document.createElement('project-card');

    card.setAttribute('img-small', p.imgSmall);
    card.setAttribute('img-medium', p.imgMedium);
    card.setAttribute('img-large', p.imgLarge);
    card.setAttribute('img-alt', p.imgAlt || '');
    card.setAttribute('title', p.title || 'Untitled Project');
    card.setAttribute('stack', Array.isArray(p.stack) ? p.stack.join(',') : (p.stack || ''));
    if (p.source) {
      card.setAttribute('source', p.source || '#');
    }

    // details text goes inside as light DOM so your component can read it
    card.textContent = p.details || '';

    cardsContainer.appendChild(card);
  });
}

// Loading the project cards from local storage
document.getElementById('load-local').addEventListener('click', () => {
  const rawJSON = localStorage.getItem(localKey);
  if (!rawJSON) {
    console.warn('No local projects found');
    return;
  }

  const projects = JSON.parse(rawJSON); // constructs JavaScript object from JSON string
  renderProjectCards(projects); 
});

// Loading the project cards from remote server
const remoteUrl = 'https://api.jsonbin.io/v3/b/692fe3c343b1c97be9d4698e';
document.getElementById('load-remote').addEventListener('click', async () => {
  try {
    const res = await fetch(remoteUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const jsonData = await res.json();

    // JSONBin wraps your data; sometimes it's in json.record, sometimes json
    const projects = Array.isArray(jsonData) ? jsonData : jsonData.record;
    renderProjectCards(projects);
  } catch (err) {
    console.error(err);
  }
});
