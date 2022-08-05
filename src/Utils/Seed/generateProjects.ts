import { projects } from './projects'
import { ProjectModel } from '../../Repository/Project/Project.Entity'

export const generateProjects = async (): Promise<void> => {
  for (const project of projects) {
    const existingProject = await ProjectModel.findOne({
      idoId: project.idoId,
    }).exec()

    if (existingProject) {
      console.warn(`project ${project.idoId} already exists`)

      existingProject.rounds = project.rounds
      await existingProject.save()
      console.log(`project ${project.idoId} rounds modified`)
      return
    }

    await ProjectModel.create({
      ...project,
    })

    console.log(`project ${project.idoId} created`)
  }
}
