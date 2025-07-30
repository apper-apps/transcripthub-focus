import transcripts from "@/services/mockData/transcripts.json"

class TranscriptService {
  constructor() {
    this.data = [...transcripts]
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
      createdAt: new Date().toISOString(),
      status: "completed"
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

export const transcriptService = new TranscriptService()