# GlIMPSE : Be at your speed
## Introduction
Glimpse aims to enhance users' browsing experience by providing an array of productivity features that are seamlessly integrated into their browsing environment. The extension facilitates efficient bookmarking with automatic tag assignment using machine learning algorithms, offers customisable tagging options, enables organised To-Do lists with tag-based organisation, displays motivational quotes on the browser's homepage, and introduces a unique miniature preview feature for web links.

Glimpse also provides users with weather information of their current location and the estimated time to read an article. Users can customise the browser's homepage with a background image of their choice, either by uploading an image or selecting one from a collection of images. Additionally, users can choose to display a random image from the web using keywords. The extension also supports live background images (GIFs).

### [Video Demo Link](https://www.youtube.com/watch?v=2-xq-xKDtvk)
[![Glimpse Demo](https://img.youtube.com/vi/2-xq-xKDtvk/0.jpg)](https://www.youtube.com/watch?v=2-xq-xKDtvk)

## Features
1. **Bookmarking with Automatic Tag Assignment**:
    - Automatically assigns tags to bookmarks based on the content of the webpage.
    - Users can customise the tags assigned to bookmarks.
2. **Tag-based Organisation**:
    - Organise bookmarks using tags.
    - Users can create, edit, and delete tags.
3. **Web Link Preview**:
    - Preview the content of a web link by hovering over it.
    - User can see the estimated time to read the article.
    - Users can summarise the content of the link and view a miniature preview of the webpage.

4. **Weather Information**:
    - Users can view the weather information of their current location at current time.
    
5. **Motivational Quotes**:
    - Displays motivational quotes on the browser's homepage.

6. **Background Image**:
    - Customise the browser's homepage with a background image.
    - Users can upload their own images or choose from a collection of images.
    - User can also choose to display a random image from the web using keywords.
    - User can put live background images (GIFs) as well.

## Technologies Used
- **Frontend**:
    - **[Plasmo](https://www.plasmo.com/)** : A platform for building browser extensions.
    - **[React](https://react.dev/)** : A JavaScript library for building user interfaces.
    - **[TypeScript](https://www.typescriptlang.org/)** : A typed superset of JavaScript that compiles to plain JavaScript.
    - **[Tailwind CSS](https://tailwindcss.com/)** : A utility-first CSS framework for rapidly building custom designs.
    - **[shadcn/ui](https://ui.shadcn.com/)** : An UI library for React with Tailwind CSS.

- **Backend**:
    - **[flask](https://flask.palletsprojects.com/)** : A lightweight WSGI web application framework.
    - **[Flask-CORS](https://flask-cors.readthedocs.io/en/latest/)** : A Flask extension for handling Cross-Origin Resource Sharing (CORS).
    - **[BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)** : A Python library for pulling data out of HTML and XML files.
    - **[OpenWeatherMap API](https://openweathermap.org/api)** : An API for weather data.
    - **[Unsplash API](https://unsplash.com/developers)** : An API for high-quality images.
    - **[spaCy](https://spacy.io/)** : A Python library for Natural Language Processing.
    - **[nltk](https://www.nltk.org/)** : A Python library for Natural Language Processing.
    - **[scikit-learn](https://scikit-learn.org/stable/)** : A Python library for machine learning.
    - **[Hugging Face Transformers](https://huggingface.co/transformers/)** : A Python library for Natural Language Processing.

## Installation - Frontend
1. Clone the repository. 
    ```bash
    git clone https://github.com/Gardians-Of-Code/glimpse.git
    ```
2. Build the extension.
    ```bash
    npm install
    npm run build
    ```
3. create a `.env` file in the root directory of the project and add the environment variables as shown in the `.env.example` file. 
    ```bash
    PLASMO_PUBLIC_BACKEND_URL="http://localhost:5000"
    ```
    - `PLASMO_PUBLIC_BACKEND_URL` : The URL of the API server.

4. Load the extension on your browser.
    - Open the Extension Management page by navigating to `chrome://extensions`.
    - Enable Developer Mode by clicking the toggle switch next to Developer mode.
    - Click the `Load unpacked` button and select the `build/chrome-mv3-build` directory in the cloned repository.

## Installation - Backend
For the backend, follow the instructions in the [backend README](https://github.com/Gardians-Of-Code/glimpse-backend?tab=readme-ov-file#readme).
