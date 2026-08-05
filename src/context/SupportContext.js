import { useSelector, useDispatch } from 'react-redux';
import { addTicket as addTicketAction } from '../store/slices/supportSlice';

export function useSupport() {
  const dispatch = useDispatch();
  const { faqs, articles, tickets } = useSelector(state => state.support);

  const addTicket = (ticketData) => dispatch(addTicketAction(ticketData));

  return { faqs, articles, tickets, addTicket };
}
