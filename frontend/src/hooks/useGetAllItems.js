import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/constant";

export const useGetAllItems = (page) => {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}/api/item/getAllItems?page=${page}&limit=5`,
        { withCredentials: true }
      );

      if (data.success) {
        setItems(data.data || []);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalItems(data.pagination.total || 0);
      } else {
        setError(data.message || "Failed to fetch items");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, totalPages, totalItems, loading, error };
};
