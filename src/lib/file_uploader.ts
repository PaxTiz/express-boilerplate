import { existsSync } from 'fs'
import { mkdir, readFile as fsReadFile, rm, writeFile } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'

const baseDirectory = join(__dirname, '..', '..')
const uploadDirectory = join(baseDirectory, 'upload')

type UploadImageOptions = {
    data: Buffer
    name: string
    directory?: string
    format: 'webp' | 'png'
}

export const uploadImage = async (options: UploadImageOptions) => {
    let uploadedDirectory = uploadDirectory
    if (options.directory) {
        uploadedDirectory = join(
            uploadedDirectory,
            Array.isArray(options.directory) ? join(...options.directory) : options.directory,
        )
    }

    if (!existsSync(uploadedDirectory)) {
        await mkdir(uploadedDirectory, { recursive: true })
    }

    const imageName = `${options.name.toLowerCase()}.${options.format}`
    let image = sharp(options.data)
    switch (options.format) {
        case 'webp':
            image = await image.webp()
            break
        case 'png':
            image = await image.png()
            break
    }

    const imageBuffer = await image.toBuffer()
    const imagePath = join(uploadedDirectory, imageName)
    await writeFile(imagePath, imageBuffer)
    const path = imagePath.split('/upload/')[1]
    return `/upload/${path}`
}

export const absolutePath = (path: string) => {
    return join(baseDirectory, path)
}

// Read as buffer by default, use utf8 = true to read as string
export const readFile = (path: string, utf8 = false) => {
    const filePath = absolutePath(path)
    return fsReadFile(filePath, { encoding: utf8 ? 'utf-8' : undefined })
}

export const remove = async (file: string) => {
    const filename = absolutePath(file)
    if (existsSync(filename)) {
        return rm(filename)
    }
}
