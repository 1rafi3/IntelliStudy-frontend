import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarkService } from '../services';
import { AddBookmarkDto, ListBookmarksQuery } from '../types';
import toast from 'react-hot-toast';

export const useBookmarksQuery = (query?: ListBookmarksQuery) => {
  return useQuery({
    queryKey: ['bookmarks', query],
    queryFn: () => bookmarkService.getAll(query),
  });
};

export const useAddBookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: AddBookmarkDto) => bookmarkService.add(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('Added to bookmarks!');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to add bookmark';
      toast.error(msg);
    },
  });
};

export const useDeleteBookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookmarkService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('Removed from bookmarks');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to remove bookmark';
      toast.error(msg);
    },
  });
};

export const useDeleteBookmarkByReferenceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, referencedId }: { type: string; referencedId: string }) =>
      bookmarkService.deleteByReference(type, referencedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('Removed from bookmarks');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to remove bookmark';
      toast.error(msg);
    },
  });
};
