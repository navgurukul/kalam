/* eslint-disable no-nested-ternary */
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  Button, TextField,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  Slider,
  Switch,
  Typography,
} from '@material-ui/core';

import * as yup from 'yup';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

export default function FormBuilder({
  list, onClick, id, notes, slug, name, mobile, stage, partnerName,
}) {
  const schema = yup.object().shape({});
  function dictUpdate(value) {
    schema.fields[value.name] = value.validation;
    schema._nodes.push(value.name);
    return null;
  }
  const {
    register, handleSubmit, errors, control, getValues, setValue,
  } = useForm({
    validationSchema: schema,
    mode: 'onBlur',
    submitFocusError: false,
    defaultValues: {
      notes,
      slug,
      name,
      mobile,
      stage,
      partnerName,
      id,
    },
  });
  const onSubmit = (values) => {
    // console.log(dictii, "Pralhad")
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(values, null, 2));
    onClick({ values, id });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} style={{ height: '410px' }}>
        {list.map((e) => (e.type === 'text'
          ? (
            <section key={e.name} style={{ marginTop: '20px' }}>
              {dictUpdate(e)}
              <TextField
                {...e.customProps}
                error={!!errors[e.name]}
                name={e.name}
                inputRef={register}
                helperText={errors[e.name] && errors[e.name].message}
              />
            </section>
          )

          : e.type === 'select'
            ? (
              <section key={e.name} style={{ marginTop: '20px' }}>
                {dictUpdate(e)}
                <FormControl
                  error={Boolean(errors[e.name])}
                  variant={e.customProps.variant ? e.customProps.variant : 'standard'}
                >
                  <InputLabel>{e.customProps.label ? e.customProps.label : ''}</InputLabel>
                  <Controller
                    as={(
                      <Select
                        {...e.customProps}
                        style={{ minWidth: 222, textAlign: 'left' }}
                      >
                        {e.options.map((option) => (
                          <MenuItem value={option}>
                            {option}
                          </MenuItem>
                        ))}

                      </Select>
                    )}
                    name={e.name}
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{errors[e.name] && errors[e.name].message}</FormHelperText>
                </FormControl>
              </section>
            )

            : e.type === 'date'
              ? (
                <section>
                  {dictUpdate(e)}
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around" style={{ marginTop: '20px' }}>
                      <FormControl
                        error={Boolean(errors[e.name])}
                      >
                        <Controller

                          as={(
                            <KeyboardDatePicker
                              style={{ width: 222, textAlign: 'left' }}
                              {...e.customProps}
                            />
)}
                          name={e.name}
                          control={control}
                          format="MM/dd/yyyy"
                        />
                      </FormControl>
                    </Grid>
                  </MuiPickersUtilsProvider>
                </section>
              )
              : e.type === 'radio'
                ? (
                  <FormControl component="fieldset" error={Boolean(errors[e.name])} style={{ marginTop: '20px' }}>
                    <FormLabel component="legend" style={{ textAlign: 'left' }}>{e.labelText}</FormLabel>
                    {dictUpdate(e)}
                    <Controller
                      as={(
                        <RadioGroup aria-label="gender">
                          {e.customProps.map((each) => (
                            <FormControlLabel
                              {...each}
                              control={<Radio />}
                              labelPlacement="end"
                            />
                          ))}
                        </RadioGroup>
                      )}
                      name={e.name}
                      control={control}
                    />
                    <FormHelperText>{errors[e.name] && errors[e.name].message}</FormHelperText>
                  </FormControl>
                )
                : e.type === 'checkbox'
                  ? (
                    <div>
                      {dictUpdate(e)}
                      <FormControl error={Boolean(errors[e.name])}>
                        <FormLabel component="legend" style={{ marginTop: '10px', textAlign: 'left' }}>{e.labelText}</FormLabel>
                        <FormGroup>
                          {e.HObbies.map((boat) => {
                            return (
                              <FormCheckBox
                                name={e.name}
                                control={control}
                                setValue={setValue}
                                getValues={getValues}
                                value={boat.id}
                                register={register}
                                defaultValue={e.preselectedHObbies.some((p) => p.id === boat.id)}
                              />
                            );
                          })}
                        </FormGroup>
                        <FormHelperText>{errors[e.name] && errors[e.name].message}</FormHelperText>
                      </FormControl>
                    </div>
                  )

                  : e.type === 'slider'
                    ? (
                      <FormControl style={{ width: '200px' }} error={Boolean(errors[e.name])}>
                        {dictUpdate(e)}
                        <FormLabel><Typography id="discrete-slider" gutterBottom>{e.name}</Typography></FormLabel>
                        <Controller
                          name={e.name}
                          control={control}
                          defaultValue={e.defaultValue ? e.defaultValue : 0}
                          onChange={([, value]) => value}
                          as={<Slider {...e.customProps} />}
                        />
                      </FormControl>
                    )
                    : e.type === 'switch'
                      ? (
                        <section name="switch">
                          {dictUpdate(e)}
                          <FormControl error={Boolean(errors[e.name])}>
                            <Controller
                              as={(
                                <FormControlLabel
                                  control={<Switch name="gilad" />}
                                  label={e.labelText}
                                />
)}
                              type="checkbox"
                              control={control}
                              name="switch"
                            />
                          </FormControl>
                        </section>
                      )
                      : ''))}

        <div style={{ marginTop: '20px' }}>
          <Button
            style={{ marginTop: '10px', marginBottom: '10px' }}
            type="submit"
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

export const FormCheckBox = ({
  name,
  value,
  register,
  defaultValue,
}) => {
  return (
    <FormControlLabel
      control={<Checkbox defaultChecked={defaultValue} />}
      name={name}
      inputRef={register}
      value={value}
      label={value}
      labelPlacement="end"
    />
  );
};
