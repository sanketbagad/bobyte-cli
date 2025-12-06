import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home Page', () => {
  it('should render the page', () => {
    render(<Home />);
    
    expect(screen.getByText('Sanket Bagad')).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    render(<Home />);
    
    const textElement = screen.getByText('Sanket Bagad');
    expect(textElement).toHaveClass('text-center');
  });
});
