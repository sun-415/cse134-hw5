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