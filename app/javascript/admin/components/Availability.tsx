import * as React from 'react';

const SPREADSHEET_LINK =
  'https://docs.google.com/spreadsheets/d/1l3uORJlrckoR3tHTfoslwzdgxs8fjRz_IcdSt8-nLeg/edit';

class Availability extends React.Component<any> {
  public render() {
    return (
      <div>
        <a href={SPREADSHEET_LINK} target="_blank" rel="noreferrer">
          Otevřít spreadsheet v novém okně
        </a>
        <iframe height="620" width="100%" style={{ border: 0 }} src={SPREADSHEET_LINK} />
      </div>
    );
  }
}

export default Availability;
