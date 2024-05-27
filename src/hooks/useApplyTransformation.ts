import { DataFrame } from '@grafana/data';
import React from 'react';

export const useApplyTransformation = (dataSeries: DataFrame[]) => {
  const [dataFrames, setDataFrames] = React.useState<DataFrame[] | undefined>();

  React.useEffect(() => {
    async function fetchData() {
      //TODO: Use the actual panel option instead of this hardcoded one
      setDataFrames(dataSeries);
    }
    fetchData();
  }, [dataSeries]);

  return dataFrames;
};
