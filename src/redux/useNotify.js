import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  showNotification,
} from './interviewActions';

/**
 * Hook for Notification Side Effect
 *
 * @example
 *
 * const notify = useNotify();
 * // simple message (info level)
 * notify('Level complete');
 * // specify level
 * notify('A problem occurred', 'warning')
 * // pass arguments to the translation function
 * notify('Deleted %{count} elements', 'info', { smart_count: 23 })
 * // show the action as undoable in the notification
 * notify('Post renamed', 'info', {}, true)
 */
const useNotify = () => {
  const dispatch = useDispatch();
  return useCallback((message, type = 'info', messageArgs = {}, undoable = false) => {
    dispatch(
      showNotification(message, type, {
        messageArgs,
        undoable,
      }),
    );
  },
  [dispatch]);
};

export default useNotify;
