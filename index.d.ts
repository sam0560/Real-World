interface author {
    username: string
    bio: null
    image: string
    following: boolean
}

export type Article  = {
    slug: string
    title: string
    description: string
    body: string
    tagList: string[]
    createdAt: string
    updatedAt: string
    favorited: boolean
    favoritesCount: number
    author: author
}