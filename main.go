package main

import (
	"encoding/json"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

// AIResource represents an AI website or news resource
type AIResource struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	URL         string    `json:"url"`
	Description string    `json:"description"`
	Category    string    `json:"category"` // "website" or "news"
	Tags        []string  `json:"tags"`
	AddedDate   time.Time `json:"addedDate"`
	ImageURL    string    `json:"imageUrl"`
}

// ResourceData holds all AI resources
type ResourceData struct {
	Resources []AIResource `json:"resources"`
}

var data ResourceData

func main() {
	// Load initial data
	loadData()

	// Set up static file server
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Set up routes
	http.HandleFunc("/", homeHandler)
	http.HandleFunc("/api/resources", resourcesAPIHandler)
	http.HandleFunc("/api/resources/add", addResourceHandler)

	// Start the server
	log.Println("Server starting on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8081", nil))
}

func loadData() {
	// Create data file if it doesn't exist
	dataPath := "data.json"
	if _, err := os.Stat(dataPath); os.IsNotExist(err) {
		// Initialize with some sample data
		data = ResourceData{
			Resources: []AIResource{
				{
					ID:          "1",
					Name:        "OpenAI",
					URL:         "https://openai.com",
					Description: "OpenAI is an AI research laboratory.",
					Category:    "website",
					Tags:        []string{"AI", "Research", "GPT"},
					AddedDate:   time.Now(),
					ImageURL:    "/static/images/openai.png",
				},
				{
					ID:          "2",
					Name:        "AI News Today",
					URL:         "https://example.com/ai-news",
					Description: "Latest news about artificial intelligence.",
					Category:    "news",
					Tags:        []string{"News", "Updates"},
					AddedDate:   time.Now(),
					ImageURL:    "/static/images/news.png",
				},
			},
		}
		saveData()
	} else {
		// Load existing data
		file, err := ioutil.ReadFile(dataPath)
		if err != nil {
			log.Fatal("Error reading data file:", err)
		}
		err = json.Unmarshal(file, &data)
		if err != nil {
			log.Fatal("Error parsing data file:", err)
		}
	}
}

func saveData() {
	dataBytes, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		log.Println("Error marshaling data:", err)
		return
	}
	err = ioutil.WriteFile("data.json", dataBytes, 0644)
	if err != nil {
		log.Println("Error saving data:", err)
	}
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	tmpl, err := template.ParseFiles(filepath.Join("templates", "index.html"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Group resources by category
	websites := []AIResource{}
	news := []AIResource{}

	for _, resource := range data.Resources {
		if resource.Category == "website" {
			websites = append(websites, resource)
		} else if resource.Category == "news" {
			news = append(news, resource)
		}
	}

	// Changed variable name from 'data' to 'templateData' to avoid confusion with global 'data'
	templateData := struct {
		Websites []AIResource
		News     []AIResource
	}{
		Websites: websites,
		News:     news,
	}

	err = tmpl.Execute(w, templateData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func resourcesAPIHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data.Resources)
}

func addResourceHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var newResource AIResource
	err := json.NewDecoder(r.Body).Decode(&newResource)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Generate a simple ID (in production, use a better ID generation method)
	newResource.ID = time.Now().Format("20060102150405")
	newResource.AddedDate = time.Now()

	// Add the new resource
	data.Resources = append(data.Resources, newResource)
	saveData()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newResource)
}
