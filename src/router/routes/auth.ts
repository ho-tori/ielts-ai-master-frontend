import AuthLayout from '../../layouts/AuthLayout.vue'

export default [
	{
		path: '/login',
		component: AuthLayout,
		children: [
			{
				path: '',
				name: 'Login',
				component: () => import('../../views/login/LoginView.vue')
			}
		]
	}
]

