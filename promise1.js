/**
 * @method
 * @param executor
 */
/**
 * 1.1 “promise” is an object or function with a then method whose behavior conforms to this specification.
 * 1.2 “thenable” is an object or function that defines a then method.
 */
function Promise(executor){
    /**
     * 1.3 “value” is any legal JavaScript value (including undefined, a thenable, or a promise).
     * 1.4 “exception” is a value that is thrown using the throw statement.
     * 1.5 “reason” is a value that indicates why a promise was rejected.
     */
    let _=this;
    _.value=undefined;
    _.exception=undefined;
    _.reason=undefined;
    /**
     * 2.1 Promise States
     * A promise must be in one of three states: pending, fulfilled, or rejected.
     */
    _.state="pending"
    /**
     * 
     */
    _.resolveCallbacks=[];
    _.rejectCallbacks=[];
    function resolve(value){
        _.value=value
        _.state="fulfilled"
        _.resolveCallbacks.forEach((fn)=>fn())
    }
    function reject(reason){
        _.reason=reason
        _.state="rejected"
        _.rejectCallbacks.forEach((fn)=>fn())
    }
    try {
        executor(resolve,reject)
    } catch (e) {
        _.exception=e;
        reject(_.exception)
    }
    
}

   
/**
 * @param {*} promise2 then的返回值
 * @param {*} x then中返回的成功或失败
 * @param {*} resolve
 * @param {*} reject
*/
/**
* The promise resolution procedure is an abstract operation taking as input a promise and a value, which we denote as [[Resolve]](promise, x). If x is a thenable, it attempts to make promise adopt the state of x, under the assumption that x behaves at least somewhat like a promise. Otherwise, it fulfills promise with the value x.
* This treatment of thenables allows promise implementations to interoperate, as long as they expose a Promises/A+-compliant then method. It also allows Promises/A+ implementations to “assimilate” nonconformant implementations with reasonable then methods.
* To run [[Resolve]](promise, x), perform the following steps:
*/
function resolvePromise(promise2,x,resolve,reject){
    /**
    * 2.3.1 If promise and x refer to the same object, reject promise with a TypeError as the reason.
    */
    let called;
    if(promise2===x){
        return reject(new TypeError("Chaining cycle"))
    }
    /** 
    * 2.3.2 If x is a promise, adopt its state [3.4]:
        * 2.3.2.1 If x is pending, promise must remain pending until x is fulfilled or rejected.
        * 2.3.2.2 If/when x is fulfilled, fulfill promise with the same value.
        * 2.3.2.3 If/when x is rejected, reject promise with the same reason.
    */
    /**
    * 2.3.3 Otherwise, if x is an object or function,
    */
    if(x!==null&&(typeof x==="object"||typeof x==="function")){
    /** 
    * 2.3.3.1 Let then be x.then. [3.5]
    * 2.3.3.2 If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
    */
        try {
            let then=x.then;
            /**
            * 2.3.3.3 If then is a function, call it with x as this, first argument resolvePromise, and second argument rejectPromise, where:
            */
           
            if(typeof then === "function"){
                
                then.call(x,y=>{
                    /**
                    * 2.3.3.3.1 If/when resolvePromise is called with a value y, run [[Resolve]](promise, y).
                    */
                    if(called) return
                    called=true
                    resolvePromise(promise2,y,resolve,reject)
                },err=>{
                    /**
                    * 2.3.3.3.2 If/when rejectPromise is called with a reason r, reject promise with r.
                    */
                    if(called) return
                    called=true
                    reject(err)
                })
            }else{
                if(called) return
                called=true
                resolve(x)
            }
            /**
            * 2.3.3.3.3 If both resolvePromise and rejectPromise are called, or multiple calls to the same argument are made, the first call takes precedence, and any further calls are ignored.
            * 2.3.3.3.3.4 If calling then throws an exception e,
            * 2.3.3.3.3.4.1 If resolvePromise or rejectPromise have been called, ignore it.
            * 2.3.3.3.3.4.2 Otherwise, reject promise with e as the reason.
            */
        } catch (error) {
            if(called) return;
            called = true;
            reject(new Error(error))
        }   

    /**
    * 2.3.4 If x is not an object or function, fulfill promise with x.
    */
    }else{
        resolve(x)
    }
    /**
    * If a promise is resolved with a thenable that participates in a circular thenable chain, such that the recursive nature of [[Resolve]](promise, thenable) eventually causes [[Resolve]](promise, thenable) to be called again, following the above algorithm will lead to infinite recursion. Implementations are encouraged, but not required, to detect such recursion and reject promise with an informative TypeError as the reason. [3.6]
    */
}
/**
 * A promise must provide a then method to access its current or eventual value or reason.
 * A promise’s then method accepts two arguments:
 * promise.then(onFulfilled, onRejected)
 */
Promise.prototype.then=function(onFulfilled, onRejected){
    let _=this;
    onFulfilled = typeof onFulfilled === 'function'?onFulfilled:val=>val;
    onRejected = typeof onRejected === 'function'?onRejected: err=>{throw err}
    /**
     * 2.2.1. Both onFulfilled and onRejected are optional arguments: 
     * If onFulfilled is not a function, it must be ignored.
     * If onRejected is not a function, it must be ignored.
     */

     /** 2.2.2. If onFulfilled is a function:
     * it must be called after promise is fulfilled, with promise’s value as its first argument.
     * it must not be called before promise is fulfilled.
     * it must not be called more than once.
     */
    
     /** 2.2.3.
     * If onRejected is a function, 
     * it must be called after promise is rejected, with promise’s reason as its first argument.
     * it must not be called before promise is rejected.
     * it must not be called more than once.
     */
    
     /** 2.2.4.
     * onFulfilled or onRejected must not be called until the execution context stack contains only platform code. [3.1].
     */
    
     /** 2.2.5.
     * onFulfilled and onRejected must be called as functions (i.e. with no this value). [3.2]
     */
    
     /** 2.2.6.
     * then may be called multiple times on the same promise.
     * If/when promise is fulfilled, all respective onFulfilled callbacks must execute in the order of their originating calls to then.
     * If/when promise is rejected, all respective onRejected callbacks must execute in the order of their originating calls to then.
     */
    
     /** 2.2.7.
     * then must return a promise [3.3].
     * promise2 = promise1.then(onFulfilled, onRejected);
     * 2.2.7.1 If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x).

     * 2.2.7.3 If onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1.
     * 2.2.7.4 If onRejected is not a function and promise1 is rejected, promise2 must be rejected with the same reason as promise1.
     */
    let promise2;
    promise2=new Promise((resolve,reject)=>{
        /**
         * 2.1 Promise States
         */
        /**
         * 2.1.1 When pending, a promise:
         * may transition to either the fulfilled or rejected state.
        */
        if(_.state=="pending"){
            _.resolveCallbacks.push(()=>{
                setTimeout(() => {
                    try {
                        let x= onFulfilled(_.value)
                        resolvePromise(promise2,x,resolve,reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0);
            })
            _.rejectCallbacks.push(()=>{
                setTimeout(() => {
                    try {
                        let x= onRejected(_.reason)
                        resolvePromise(promise2,x,resolve,reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0);
            })
        }
        /**
        * 2.1.2 When fulfilled, a promise:
        * must not transition to any other state.
        * must have a value, which must not change.
        */
       
        if(_.state=="fulfilled"){
            /**
            * 2.2.7.2 If either onFulfilled or onRejected throws an exception e, promise2 must be rejected with e as the reason.
            */
            setTimeout(() => {
                try {
                    let x=onFulfilled(_.value)
                    resolvePromise(promise2,x,resolve,reject)
                } catch (error) {
                    reject(error)
                }
            }, 0);
                
            
        }
        /**
         * 2.1.3 When rejected, a promise:
         * must not transition to any other state.
         * must have a reason, which must not change.
         */
        if(_.state=="rejected"){
            setTimeout(() => {
                try {
                    let x=onRejected(_.reason)
                    resolvePromise(promise2,x,resolve,reject)
                } catch (error) {
                    reject(error)
                }
            }, 0);
        }
    })
    //console.log(promise2.then)
    return promise2
}
Promise.defer = Promise.deferred = function(){
    let dfd = {};
    dfd.promise = new Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd;
}
module.exports=Promise
