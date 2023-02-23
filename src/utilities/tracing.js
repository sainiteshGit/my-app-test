import opentelemetry from '@opentelemetry/api';

export function reportSpan(span) {

  const { _spanContext, _ended, duration, startTime, endTime, name, parentSpanId } = span;

  const payload = {
    ..._spanContext,
    _ended,
    duration,
    startTime,
    endTime,
    name,
    parentSpanId,
  };

  console.log('report span:', JSON.stringify(payload));
  const jsonPayload=JSON.stringify(payload)
  fetch('http://localhost:5000/send-trace', {
    method: 'post',
    headers: {
        'Access-Control-Allow-Origin':'*',
      'Content-Type': 'application/json'
    },
    body: jsonPayload
  });
}

export async function withTracing(name, cb, parentSpan, report) {
  const tracer = opentelemetry.trace.getTracer('profiling-demo');
  let span;

  if (parentSpan) {
    const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parentSpan);
    span = tracer.startSpan(name, undefined, ctx);
  } else {
    span = tracer.startSpan(name);
  }

  await cb();

  span.end();

  reportSpan(span);
}

export function getTracer() {
  const tracer = opentelemetry.trace.getTracer('profiling-demo');
  return tracer;
}
