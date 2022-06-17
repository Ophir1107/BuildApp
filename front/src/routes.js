import { Home } from './pages/Home'
import { Workspace } from './pages/Workspace'
import { LoginSignup } from './pages/LoginSignup'
import { Users } from './pages/Users'
import { BoardApp } from './pages/BoardApp'
// import { AddConstructor } from './cmps/AddConstructor'

export const routes = [
    {
        path: '/board/:boardId',
        component: BoardApp,
    },
    {
        path: '/login',
        component: LoginSignup,
    },
    {
        path: '/signup',
        component: LoginSignup,
    },
    {
        path: '/users',
        component: Users,
    },
    // {
    //     path: '/constructor/add',
    //     component: AddConstructor,
    // },
    
    {
        path: '/workspace',
        component: Workspace,
    },
    {
        path: '/',
        component: Home,
    }
]