import audioFiles from "@/services/mockData/audioFiles.json"

class AudioFileService {
  constructor() {
    this.data = [...audioFiles]
  }

  async getAll() {
    await this.delay()
    return [...this.data]
  }

  async getById(id) {
    await this.delay()
    return this.data.find(item => item.Id === id) || null
  }

  async create(item) {
    await this.delay()
    const newItem = {
      ...item,
      Id: Math.max(...this.data.map(i => i.Id), 0) + 1,
      uploadDate: new Date().toISOString(),
      status: "queued"
    }
    this.data.push(newItem)
    return { ...newItem }
  }

  async update(id, data) {
    await this.delay()
    const index = this.data.findIndex(item => item.Id === id)
    if (index === -1) return null
    
    this.data[index] = { ...this.data[index], ...data }
    return { ...this.data[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.data.findIndex(item => item.Id === id)
    if (index === -1) return false
    
    this.data.splice(index, 1)
    return true
  }

  async delay() {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

export const audioFileService = new AudioFileService()