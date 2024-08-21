export function getFile(image){
    if(image === '/placeholder-user.png'){
        return image
    }
    console.log(image)
    return fetch(`${image}`)
}

export function getFileName(id, type, name){
    let isImage = type === 'profile_pics' || type === 'images'
    let nameFile = name
    if(isImage){
        const ext = name.split('.').pop()
        const imgName = name.replace(`${ext}`, 'jpeg')
        nameFile = imgName
    }
    return `https://localhost:41200/uploads/?pathFile=uploads/${id}/${
        isImage ? 'images/min' : type
    }/${nameFile}`
}