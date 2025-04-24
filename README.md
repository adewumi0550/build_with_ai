# Gemini API Integration (Node.js)

This project is a simple REST API built with Node.js to interact with the Gemini language model. It provides two main endpoints for generating text based on prompts.

## Endpoints

* **`POST /api/gemini/all`**:
    * Accepts a JSON request with a `prompt` field.
    * Sends the prompt to the Gemini API and returns the generated text response in the `data` field of the JSON response.
    * Use this endpoint for general queries and prompts.

* **`POST /api/gemini/major`**:
    * Accepts a JSON request with a `prompt` field.
    * Enhances the prompt to focus on key insights and major data points before sending it to the Gemini API.
    * Returns the generated text response in the `majorData` field of the JSON response.
    * Use this endpoint when you need the Gemini model to focus on significant information.

## Prerequisites

* **Node.js** (version >= 18 recommended)
* **npm** or **yarn**

## Setup

1.  **Clone the repository** (if you have one):
    ```bash
    git clone <repository_url>
    cd gemini-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Create a `.env` file** in the project root and add your Gemini API key:
    ```env
    API_KEY="YOUR_GEMINI_API_KEY"
    MODEL_NAME="gemini-pro" # Optional: Change the default Gemini model
    PORT=3000          # Optional: Change the default server port
    ```
    Replace `"YOUR_GEMINI_API_KEY"` with your actual Gemini API key. You can also optionally specify the `MODEL_NAME` and `PORT`.

## Running the API

**Using `node`:**

```bash
npm start
# or
node server.js