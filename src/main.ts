class TaskServices {
  private app: HTMLDivElement;
  private createTaskButton: HTMLButtonElement;

  constructor() {
    this.app = document.querySelector("#app") as HTMLDivElement
    this.createTaskButton = document.querySelector("#create-task-button") as HTMLButtonElement

    this.init()
  }

  async init() {

    this.createTaskButton.addEventListener("click", (e) => {
      e.preventDefault()
      this.createTask()
    })


    /*Init 3 column*/
    this.app.innerHTML = `
      <div id="kanban-lane" class="grid grid-cols-3">
        <div>
          <p class="font-xl bg-white border-2 border-gray-500 p-2 rounded-lg">Not started</p>
          <div id="not-started" class="bg-gray-200 h-screen p-2 flex flex-col gap-2">
          </div>
        </div>
        <div>
          <p class="font-xl bg-white border-2 border-gray-500 p-2 rounded-lg">On progress</p>
         <div id="on-progress" class="bg-yellow-200 h-screen p-2 flex flex-col gap-2"></div>
        </div>
        <div>
          <p class="font-xl bg-white border-2 border-gray-500 p-2 rounded-lg">Done</p>
          <div id="done" class="bg-green-200 h-screen p-2 flex flex-col gap-2"></div>
        </div>
      </div>
    `

    const idList: string[] = ["not-started", "on-progress", "done"]

    idList.map(id => {
      const column = document.getElementById(id)
      column?.addEventListener("dragover", (e) => {
        e.preventDefault()
      })

      column?.addEventListener("drop", (e) => {
        e.preventDefault()
        const taskId = e.dataTransfer?.getData("text")
        const task = document.getElementById(taskId as string)

        column.appendChild(task as HTMLElement)

        let tasks: { id: string, state: string, content: string }[] = JSON.parse(localStorage.getItem("task") || "[]")
        const taskIndex = tasks.findIndex(t => t.id === taskId)
        tasks[taskIndex] = {
          id: tasks[taskIndex].id,
          state: column.id,
          content: tasks[taskIndex].content
        }


        localStorage.setItem("task", JSON.stringify(tasks))

      })
    })

    this.getTask()

  }

  async createTask() {

    let tasks = JSON.parse(localStorage.getItem("task") || "[]")
    const taskId = `task-${Date.now()}`
    const taskState = "not-started"
    const content = "Todo"

    tasks.push({
      id: taskId,
      state: taskState,
      content: content
    })

    localStorage.setItem("task", JSON.stringify(tasks))

    const element = document.createElement("div")
    const button = document.createElement("button")
    element.classList.add("bg-white", "p-2", "rounded-lg", "border-red-200", "border-2")
    element.textContent = content
    element.draggable = true
    element.id = taskId
    button.textContent = "delete"
    button.id = taskId
    element.appendChild(button as HTMLButtonElement)

    button.addEventListener("click", (e: Event) => {
      e.stopPropagation()

      this.deleteTask(button.id)
    })

    element.addEventListener("dragstart", (e: DragEvent) => {
      const target = e.target as HTMLElement
      e.dataTransfer?.setData("text", target.id)
      target.classList.add("dragging")
    })

    element.addEventListener("dragend", (e: DragEvent) => {
      const target = e.target as HTMLElement
      target.classList.remove("dragging")

    })
    document.querySelector("#not-started")?.appendChild(element)
  }

  async deleteTask(id: string) {
    let tasks: { id: string, state: string, content: string }[] = JSON.parse(localStorage.getItem("task") || "[]")
    const taskIndex = tasks.findIndex(t => t.id === id)
    tasks.splice(taskIndex, 1)
    localStorage.setItem("task", JSON.stringify(tasks))
    document.querySelector(`#${id}`)?.remove()
  }

  async getTask() {
    const tasks: { id: string, state: string, content: string }[] = JSON.parse(localStorage.getItem("task") || "[]")
    tasks.forEach(task => {
      const element = document.createElement("div")
      const button = document.createElement("button")
      element.classList.add("bg-white", "p-2", "rounded-lg", "border-red-200", "border-2")
      element.textContent = task.content
      element.draggable = true
      element.id = task.id
      button.textContent = "delete"
      button.id = task.id
      button.addEventListener("click", (e: Event) => {
        e.stopPropagation()

        this.deleteTask(button.id)
      })

      element.appendChild(button as HTMLButtonElement)

      element.addEventListener("dragstart", (e: DragEvent) => {
        const target = e.target as HTMLElement
        e.dataTransfer?.setData("text", target.id)
        target.classList.add("dragging")
      })

      element.addEventListener("dragend", (e: DragEvent) => {
        const target = e.target as HTMLElement
        target.classList.remove("dragging")

      })

      document.querySelector(`#${task.state}`)?.appendChild(element)
    })

  }
}

new TaskServices()
