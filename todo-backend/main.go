package main

import (
    "encoding/json"
    "log"
    "net/http"
    "github.com/gorilla/handlers"
    "github.com/gorilla/mux"
)

type Todo struct {
    ID        string `json:"id"`
    Text      string `json:"text"`
    Completed bool   `json:"completed"`
}

var todos []Todo

func getTodos(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(todos)
}

func createTodo(w http.ResponseWriter, r *http.Request) {
    var todo Todo
    _ = json.NewDecoder(r.Body).Decode(&todo)
    todos = append(todos, todo)
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(todo)
}

func deleteTodos(w http.ResponseWriter, r *http.Request) {
    todos = []Todo{}
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(todos)
}

func deleteTodoById(w http.ResponseWriter, r *http.Request) {
    params := mux.Vars(r)
    id := params["id"]
    for index, todo := range todos {
        if todo.ID == id {
            todos = append(todos[:index], todos[index+1:]...)
            break
        }
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(todos)
}

func main() {
    router := mux.NewRouter()
    todos = append(todos, Todo{ID: "1", Text: "Sample Todo", Completed: false})

    router.HandleFunc("/todos", getTodos).Methods("GET")
    router.HandleFunc("/todos", createTodo).Methods("POST")
    router.HandleFunc("/todos", deleteTodos).Methods("DELETE")
    router.HandleFunc("/todos/{id}", deleteTodoById).Methods("DELETE")

    // Set up CORS
    allowedOrigins := handlers.AllowedOrigins([]string{"http://localhost:3000"})
    allowedMethods := handlers.AllowedMethods([]string{"GET", "POST", "DELETE"})
    allowedHeaders := handlers.AllowedHeaders([]string{"Content-Type"})

    log.Fatal(http.ListenAndServe(":8000", handlers.CORS(allowedOrigins, allowedMethods, allowedHeaders)(router)))
}
