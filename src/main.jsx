import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import Default from './components/Default';
import Produto from './pages/Produto';
import DefaultHome from './pages/DefaultHome'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
				element: <DefaultHome />
			},
		{
			path: "produto/:product",
			element:<Produto />
		},
		{
			path: ":param1",
			element: <Default />
		},
		{
			path: ":param1/:param2",
			element: <Default />
		},
		{
			path: ":param1/:param2/:param3",
			element: <Default />
		}
		]
	},
])

root.render(
	<RouterProvider router={router}/>
);
