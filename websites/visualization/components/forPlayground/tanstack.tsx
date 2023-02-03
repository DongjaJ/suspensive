import { useQuery } from '@tanstack/react-query'
import { albums, posts, todos } from './api'
import { Spinner } from '../uis'

export const PostListTanStack = () => {
  const postsQuery = useQuery(['posts'], posts.getMany)

  if (postsQuery.isLoading) {
    return <Spinner />
  }
  if (postsQuery.isError) {
    return <>error</>
  }

  return (
    <ul style={{ maxWidth: 600 }}>
      {postsQuery.data.map((post) => (
        <li key={post.id}>
          <h3>Title: {post.title}</h3>
          <Post id={post.id} />
        </li>
      ))}
    </ul>
  )
}

export const Post = ({ id }: { id: number }) => {
  const postQuery = useQuery(['posts', id], () => posts.getOneBy({ id }))
  const albumsQuery = useQuery(
    ['users', postQuery.data?.userId, 'albums'],
    () => albums.getManyBy({ userId: postQuery.data?.userId || 0 }),
    { enabled: !!postQuery.data?.userId }
  )
  const todosQuery = useQuery(
    ['users', postQuery.data?.userId, 'todos'],
    () => todos.getManyBy({ userId: postQuery.data?.userId || 0 }),
    { enabled: !!postQuery.data?.userId }
  )

  if (postQuery.isLoading || albumsQuery.isLoading || todosQuery.isLoading) {
    return <Spinner />
  }
  if (postQuery.isError || albumsQuery.isError || todosQuery.isError) {
    return <>error</>
  }

  return (
    <div>
      <p>Body: {postQuery.data.body}</p>
      <h5>Album List:</h5>
      <ul>
        {albumsQuery.data.map((album) => (
          <li key={album.id}>{album.title}</li>
        ))}
      </ul>
      <h5>Todo List:</h5>
      <ul>
        {todosQuery.data.map((todo) => (
          <li key={todo.id}>
            <button>{todo.completed ? 'completed' : 'todo'}</button> {todo.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
