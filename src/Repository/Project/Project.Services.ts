import { ProjectInput } from './Project.InputTypes'
import { Project, ProjectModel } from './Project.Entity'
import { AppFileModel } from '../File/File.Entity'

export const saveFile = async (fileId?: string): Promise<void> => {
    if (fileId) {
        const file = await AppFileModel.findById(fileId).exec()

        if (!file) {
            throw new Error(`file not found for ${fileId}`)
        }

        file.isUsed = true
        await file.save()
    }
}

export const saveProject = async (data: ProjectInput): Promise<Project> => {
    data.logo && await saveFile(data.logo)
    data.cover && await saveFile(data.cover)

    return await ProjectModel.findOneAndUpdate({
        idoId: data.idoId
    }, {
        ...data
    }, { new: true }).exec()
}
