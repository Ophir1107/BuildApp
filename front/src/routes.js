import { Home } from './pages/Home'
import { Workspace } from './pages/Workspace'
import { LoginSignup } from './pages/LoginSignup'
import { Constructor } from './pages/Constructor'
import { BoardApp } from './pages/BoardApp'
import { AddConstructor } from './cmps/AddConstructor'

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
        path: '/constructor',
        component: Constructor,
    },
    {
        path: '/constructor/add',
        component: AddConstructor,
    },
    
    {
        path: '/workspace',
        component: Workspace,
    },
    {
        path: '/',
        component: Home,
    }
]