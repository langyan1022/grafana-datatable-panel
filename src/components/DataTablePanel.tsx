import jQuery from 'jquery';
import 'datatables.net';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

import { PanelProps } from '@grafana/data';
import { useApplyTransformation } from 'hooks/useApplyTransformation';
import React, { useEffect, useRef } from 'react';
import { SimpleOptions } from 'types';
import { dataFrameToDataTableFormat } from 'dataHelpers';
//TODO many more css files missing
import '../css/datatables.css';
interface Props extends PanelProps<SimpleOptions> {}

export const DataTablePanel: React.FC<Props> = (props: Props) => {
  const { data, height ,options} = props;

  const dataTableId = `data-table-renderer-${props.id}`;

  const dataTableDOMRef = useRef<HTMLTableElement>(null);
  //TODO actually pass what transformations to use from the options
  //currently simply doing a join by field (series to columns)
  const dataFrames = useApplyTransformation(data.series);
  const { columns, rows } = (dataFrames && dataFrameToDataTableFormat(dataFrames,options)) || { columns: [], rows: [] };

  // actually render the table
  useEffect(() => {
    if (dataTableDOMRef.current && columns.length > 0) {
      if (!jQuery.fn.dataTable.isDataTable(dataTableDOMRef.current)) {
       let dataTable= jQuery(dataTableDOMRef.current).DataTable({
          columns,
          data: rows,
          pagingType: 'full_numbers',
          paging: options.paging,
          ordering:  options.ordering,
          autoWidth: options.autoWidth,
          //TODO these hardcoded height values come from observing the elements datatable creates
          // the scroll Y you pass will be the data part of the table itself, datatable will
          // create all the headers, pagination, etc... and it will not consider it into the
          // final height calculation. So we need to exclude it.
          // this blogpost might have a better way to achieve this
          // https://datatables.net/blog/2017/vertical-scroll-fitting
          // leaving it here for now while I move on
          scrollY: `${height - 32 - 42 - 43}px`,
          scrollCollapse: false,
          search: {
            regex: true,
            smart: false,
          },
          lengthChange: true,
          lengthMenu: [10, 25, 50, 100],
          language:{
            paginate:{
                next:"下一页",
                previous:"上一页"
            }
          }
        });

        dataTable.on('draw', function () {
            tippy('a.tb-tooltips', {
                allowHTML: true, // 允许内容为HTML
                content(reference) {
                    let id = reference.getAttribute('data-target');
                    let template = document.getElementById(id);
                    return template?template.innerHTML:"";
                  }
              });
        });
      }

      //防止刚进入页面的首页不展示tootlip
      tippy('a.tb-tooltips', {
        allowHTML: true, // 允许内容为HTML
        content(reference) {
            let id = reference.getAttribute('data-target');
            let template = document.getElementById(id);
            return template?template.innerHTML:"";
          }
      });
    }
    const currentDom = dataTableDOMRef.current;

    // make sure we clean up on unmount
    return () => {
      if (currentDom && jQuery.fn.dataTable.isDataTable(currentDom)) {
        jQuery(currentDom).DataTable().destroy();
      }
    };
  }, [columns, height, rows]);

  return (
    <div className="resizer">
      <table id={dataTableId} ref={dataTableDOMRef}></table>
    </div>
  );
};
