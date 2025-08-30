import React from 'react';
import { ListeningBuilder } from '../admin/iels_builder/listening';

const ListeningBuilderExample: React.FC = () => {
  const handleSave = (data: any) => {
    console.log('Saving data:', data);
    // In a real application, you'd send this to your backend API
    alert('Test data saved to console. Check developer tools.');
  };

  return (
    <div className="container">
      <h1>IELTS Listening Test Builder</h1>
      <ListeningBuilder onSave={handleSave} />
    </div>
  );
};

export default ListeningBuilderExample;