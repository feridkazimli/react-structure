import React from 'react'

type ProviderType<P> = [React.ComponentType<P>, P]
type ChildrenType = {
	children: React.ReactNode
}

// Her elemanın kendi prop tipine sahip olmasını sağlamak için generik bir tuple tipi kullanıyoruz.
export const buildProviderTree = <T extends readonly unknown[]>(
	componentWithProps: [...{ [K in keyof T]: ProviderType<T[K]> }],
) => {
	const inititalComponent = ({ children }: ChildrenType) => <>{children}</>

	return componentWithProps.reduceRight((AccumulatedComponents, [Provider, props]) => {
		return ({ children }: ChildrenType) => (
			<AccumulatedComponents>
				<Provider {...(props as object)}>{children}</Provider>
			</AccumulatedComponents>
		)
	}, inititalComponent as React.ComponentType<ChildrenType>)
}
