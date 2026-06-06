export interface CoreTeam {
  name: string
  github: string
  avatar: string
  description: string
  twitter?: string
  sponsors?: boolean
  functions?: string[]
  packages?: string[]
}

export interface Contributor {
  name: string
  avatar: string
}

export const coreTeamMembers: CoreTeam[] = [
  {
    name: 'Ywenhao',
    github: 'ywenhao',
    avatar: 'https://github.com/ywenhao.png',
    description: 'Project maintainer',
  },
]

export const contributors: Contributor[] = coreTeamMembers.map(member => ({
  name: member.github,
  avatar: member.avatar,
}))
