import { DataFrame } from '@grafana/data';
import { ConfigColumns } from 'datatables.net';
import { SimpleOptions } from 'types';

function createRenderFunction(renderString: string): ((data: string, type: string, row: any, meta: any) => string) | undefined {  
    try {  
        // 创建一个包装函数，该函数会捕获并处理在renderString中定义的代码执行时可能发生的异常  
        const fn = new Function('data', 'type', 'row', 'meta', `  
            try {  
                // 调用由renderString定义的代码  
                return (function() {  
                    ${renderString}  
                })();  
            } catch (e) {  
                console.error('渲染时出错:', e);  
                // 如果渲染出错，返回默认的错误HTML  
                return '<div>渲染失败: ' + e.message + '</div>';  
            }  
        `);  
  
        // 确保函数具有正确的类型注解  
        return fn as (data: string, type: string, row: any, meta: any) => string;  
    } catch (error) {  
        console.error(error);  
        console.error(`无法将字符串 "${renderString.trim()}" 转换为函数`);  
        // 返回一个默认函数，可能只是简单返回错误信息  
        return (data: string, type: string, row: any, meta: any) => `<div>无法渲染，函数创建失败。</div>`;  
    }  
}  

export function dataFrameToDataTableFormat<T>(dataFrames: DataFrame[], options: SimpleOptions): { columns: ConfigColumns[]; rows: T[] } {
    const dataFrame = dataFrames[0];
    const dataFrameFields = dataFrame.fields;
    console.log(options);
    const columns = dataFrameFields.map((field) => {
        const matchingRender = options.columnRender && options.columnRender.find((cr) => cr.name === field.name);
        const matchingWidth = options.columnWidthHints && options.columnWidthHints.find((cw) => cw.name === field.name);
        console.log(matchingWidth);
        const renderFn = matchingRender?.render && createRenderFunction(matchingRender.render);
       

        return {
            title: field.name,
            data: field.name,
            render: renderFn || ((data, type, row, meta) => data), // 如果没有匹配到render函数，提供一个默认处理
            width: matchingWidth?.width || "null",
        };
    });


    const rows = [] as T[];

    for (let i = 0; i < dataFrame.length; i++) {
        const row = {};
        for (let j = 0; j < columns.length; j++) {
            const value = dataFrame.fields[j].values[i];
            //@ts-ignore
            row[columns[j].data] = value;
        }
        rows.push(row as T);
    }

    return { columns, rows };
}
