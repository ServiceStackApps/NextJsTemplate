import Link from 'next/link'
import { ErrorResponse, errorResponse, errorResponseExcept } from '@servicestack/client';
import { createContext, FC, SyntheticEvent, useContext, useState } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { XCircleIcon } from '@heroicons/react/solid'
import { NextRouter, useRouter } from 'next/router';

type FormState = { loading:boolean, responseStatus?:ErrorResponse }
export const FormContext = createContext<FormState>({ loading: false })
export type SuccessContext<T> = { response?:T, router:NextRouter }
export type SuccessEventHandler<T> = (ctx:SuccessContext<T>) => Promise<any>;

type FormProps = {
    className?: string,
    method?: string,
    onSubmit: (e:SyntheticEvent<HTMLFormElement>) => Promise<any>|void,
    onSuccess?: SuccessEventHandler<any>,
    children: React.ReactNode,
}
export const Form: FC<FormProps> = (props) => {
    const { className, method, onSubmit, onSuccess, children, ...remaining } = props
    let [responseStatus, setResponseStatus] = useState<ErrorResponse|undefined>()
    let [loading, setLoading] = useState(false)
    let router = useRouter()

    const handleSubmit = async (e:SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (onSubmit) {
            setLoading(true)
            try {
                setResponseStatus(undefined)

                let response = await onSubmit(e)
                if (onSuccess) {
                    onSuccess({ response, router })
                }
            } catch (e:any) {
                console.log('ERROR', e)
                setResponseStatus(e.responseStatus ?? e)
            } finally {
                setLoading(false)
            }
        }
    }
    return (<FormContext.Provider value={{ loading, responseStatus }}>
        <form method={method ?? 'POST'} className={className} onSubmit={handleSubmit} {...remaining}>{children}</form>
    </FormContext.Provider>)
}

type ErrorSummaryProps = {
    except: string | string[]
}
export const ErrorSummary: FC<ErrorSummaryProps> = ({ except }) => {
    const ctx = useContext(FormContext);
    const status = ctx?.responseStatus;
    const errorSummary = status ? errorResponseExcept.call(ctx,except) : null;
    if (!errorSummary) return null;

    return (<div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
            <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
                <p className="text-sm text-red-700">{errorSummary}</p>
            </div>
        </div>
    </div>)
};

type InputProps = {
    id: string,
    name: string,
    className?: string,
    type?: string,
    description?: string,
    placeholder?: string,
} | any
export const Input: FC<InputProps> = ({ type, id, name, className, description, placeholder, ...remaining }) => {
    placeholder ??= name;

    const ctx = useContext(FormContext);
    const status = ctx?.responseStatus;
    const errorField = id && status && errorResponse.call(ctx,id);

    let cls = ['block w-full sm:text-sm rounded-md', errorField 
        ? 'pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
        : 'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300', className];            
    let extraUI:any[] = [];
    if (errorField) {
        extraUI.push((<div key="error-icon" className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
        </div>));
        description = errorField;
    } 
    if (description) {
        let descriptionId = id + '-description';
        remaining['aria-describedby'] = descriptionId;        
        extraUI.push(<p key="description" className={`mt-2 text-sm ${errorField ? 'text-red-500' : 'text-gray-500'}`} id={descriptionId}>{description}</p>)
    }

    return (<div className="relative">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {name}
        </label>
        <div className="mt-1">
          <input
            type={type ?? 'text'}
            name={id}
            id={id}
            className={cls.join(' ')}
            placeholder={placeholder}
            {...remaining} />
        </div>
        {[...extraUI]}
      </div>);
}

type CheckboxProps = {
    id: string,
    name: string,
    description?: string,
} | any
export const Checkbox: FC<CheckboxProps> = ({ id, name, description, ...remaining }) => {

    const ctx = useContext(FormContext);
    const status = ctx?.responseStatus;
    const errorField = id && status && errorResponse.call(ctx,id);
    let extraUI:any[] = [];
    if (errorField) {
        extraUI.push((<div key="error-icon" className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
        </div>));
        description = errorField;
    } 
    if (description) {
        let descriptionId = id + '-description';
        remaining['aria-describedby'] = descriptionId;        
        extraUI.push(<p key="description" className={`mt-2 text-sm ${errorField ? 'text-red-500' : 'text-gray-500'}`} id={descriptionId}>{description}</p>)
    }

    return (<div className="relative flex items-start">
        <div className="flex items-center h-5">
            <input
                id={id}
                name={id}
                type="checkbox"
                value="true"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                {...remaining} />
        </div>
        <div className="ml-3 text-sm">
            <label htmlFor={id} className="font-medium text-gray-700 select-none">
                {name}
            </label>
            {[...extraUI]}
        </div>
    </div>)
}

type ButtonProps = {
    type?: string,
    className?: string,
    href?: string,
    children: React.ReactNode,
} | any;
export const PrimaryButton: FC<ButtonProps> = (props) => {
    const { type, className, children, ...remaining } = props;
    return (<button type={type ?? "submit"}
        className={["inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",className].join(' ')}
      {...remaining}>{children}</button>  
    )
}
export const Button: FC<ButtonProps> = (props) => {
    const { type, className, href, children, ...remaining } = props;
    let cls = ["bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",className].join(' ');
    return href
        ? <Link href={href}><a className={cls} {...remaining}>{children}</a></Link>
        : <button type={type ?? "submit"} className={cls} {...remaining}>{children}</button>
}

type FormLoadingProps = {
    className?: string,
    icon?: boolean,
    text?: string,
}
export const FormLoading: FC<FormLoadingProps> = ({ className, icon, text }) => {
    const ctx = useContext(FormContext);
    if (!ctx.loading) return null;

    const showIcon = icon || icon === undefined;
    const showText = text === undefined ? "loading..." : text;
    let cls = ["flex", className];

    return (<div className={cls.join(' ')} title="loading...">
    {showIcon ? (<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30">
      <rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="8" y="10" width="4" height="10" fill="#333"  opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="16" y="10" width="4" height="10" fill="#333"  opacity="0.2">
        <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
        <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
      </rect>
    </svg>) : null}
    <span className="ml-1 text-gray-400">{showText}</span>
  </div>)
}