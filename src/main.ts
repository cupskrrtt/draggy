class MainService {
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
      })
    })

  }

  async createTask() {
    const task = document.createElement("div")
    task.classList.add("bg-white")
    task.classList.add("p-2")
    task.classList.add("rounded-lg")
    task.classList.add("border-red-200")
    task.classList.add("border-2")
    task.textContent = "Todo"
    task.draggable = true
    task.id = `task-${Date.now()}`
    document.getElementById("not-started")?.appendChild(task)

    task.addEventListener("dragstart", (e: DragEvent) => {
      const target = e.target as HTMLElement
      e.dataTransfer?.setData("text", target.id)
      target.classList.add("dragging")
    })

    task.addEventListener("dragend", (e: DragEvent) => {
      const target = e.target as HTMLElement
      target.classList.remove("dragging")

    })
  }
}

new MainService()
