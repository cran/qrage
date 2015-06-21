\name{renderQrage}
\alias{renderQrage}
\docType{methods}
\title{
Force Directed Graph Output with the JavaScript
}
\description{
Makes a reactive version of the given function that returns a graph object of qrage. D3 JavaScript was created by Michael Bostock. See http://d3js.org/ and, more specifically for Force Directed Graph https://github.com/mbostock/d3/wiki/Force-Layout.
}
\usage{
renderQrage(expr,env = parent.frame(),quoted = FALSE)
}
\arguments{
  \item{expr}{An expression that returns a graph object of qrage package.}
  \item{env}{The environment in which o ecaluate expr.}
  \item{quoted}{Is expr a quoted expression(with quote())? This is useful if you want to save an expression in a variable.}
}
\examples{
renderQrage({
		  data(links)
    	data(nodeColor)
    	data(nodeValues)
    	w <- qrage(links,nodeColor=nodeColor,nodeValue=nodeValues,cut=0.1)
    	return(w)
})
}
