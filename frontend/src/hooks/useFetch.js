import { useState, useEffect, useCallback, useRef } from 'react'

export default function useFetch(fetchFn) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mounted = useRef(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchFn()
      if (mounted.current) setData(res.data?.data ?? res.data)
    } catch (err) {
      if (mounted.current) setError(err.response?.data?.message ?? err.message ?? 'An error occurred')
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [fetchFn])

  useEffect(() => {
    mounted.current = true
    fetch()
    return () => { mounted.current = false }
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}
