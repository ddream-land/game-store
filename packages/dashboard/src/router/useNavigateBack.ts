import { useNavigate } from 'react-router-dom'

export function useNavigateBack() {
  const navigate = useNavigate()

  function back() {
    navigate(-1)
  }

  return {
    back,
  }
}
