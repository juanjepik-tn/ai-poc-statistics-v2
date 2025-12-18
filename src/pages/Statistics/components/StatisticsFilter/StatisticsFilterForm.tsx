import {
  Box,
  Button,
  Icon,
  Input,
  Popover,
  Radio,
  Sidebar,
} from '@nimbus-ds/components';
import { CalendarIcon } from '@nimbus-ds/icons';
import { Calendar, FormField, Layout } from '@nimbus-ds/patterns';
import { format, subDays } from 'date-fns';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface StatisticFilterProps {
  open: boolean;
  toggleOpen: () => void;
  filters: any;
  setFilters: (filters: any) => void;
}

const StatisticsFilterForm: React.FC<StatisticFilterProps> = ({ open, toggleOpen, setFilters }) => {
    const { t } = useTranslation('translations');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();        
        setFilters({
            dateFrom: selectedDateFrom,
            dateTo: selectedDateTo,            
        });
        toggleOpen();
    };
    const [selectedDateFrom, setSelectedDateFrom] = useState<Date | undefined>(subDays(new Date(), 7));
    const [selectedDateTo, setSelectedDateTo] = useState<Date | undefined>(new Date());
    const [selectedFilter, setSelectedFilter] = useState('7');
    const calendarFrom = (
        <Calendar
            mode="single"
            showOutsideDays
            selected={selectedDateFrom}
            onSelect={(date) => date && setSelectedDateFrom(date)}
            hideBorder
            fullWidthDays
            containerProps={{
                width: "100%",
                height: "100%",
                overflowY: "auto",
                maxHeight: "400px",
            }}
        />
    )
    const calendarTo = (
        <Calendar
            mode="single"
            showOutsideDays
            selected={selectedDateTo}
            onSelect={(date) => date && setSelectedDateTo(date)}
            hideBorder
            fullWidthDays
            containerProps={{
                width: "100%",
                height: "100%",
                overflowY: "auto",
                maxHeight: "400px",
            }}
        />
    )   
    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {               
        setSelectedFilter(event.target.value);        
        if (event.target.value !== 'custom') {
            setSelectedDateFrom(subDays(new Date(), parseInt(event.target.value, 10)));
            setSelectedDateTo(new Date());
        }       
      };
    return (
        <>
            <Sidebar maxWidth="500px" padding="base" open={open} onRemove={() => {
                toggleOpen();
            }}>
                <Sidebar.Header title={t('statistics.filter-title')} />
                <Sidebar.Body>
                    <Layout columns="1">
                        <Layout.Section>
                            <form onSubmit={(e: React.FormEvent) => handleSubmit(e)}>
                                <Layout columns="1">
                                    <Layout.Section>
                                        <FormField
                                            label={t('statistics.filter-date-range')}
                                        >
                                            <Box display="flex" gap="1">
                                                 {/* @ts-ignore */}
                                                <Radio as="button" name="radio" id="radio-1" label={t('statistics.filter-option.today')} value="0" checked={selectedFilter === '0'} onChange={handleFilterChange} />
                                                 {/* @ts-ignore */}
                                                <Radio as="button" name="radio" id="radio-2" label={t('statistics.filter-option.last-7-days')} value="7" checked={selectedFilter === '7'} onChange={handleFilterChange} />
                                                {/* @ts-ignore */}
                                                 <Radio as="button" name="radio" id="radio-3" label={t('statistics.filter-option.last-30-days')} value="30" checked={selectedFilter === '30'} onChange={handleFilterChange} />
                                                 {/* @ts-ignore */}
                                                <Radio as="button" name="radio" id="radio-4" label={t('statistics.filter-option.custom')} value="custom" checked={selectedFilter === 'custom'} onChange={handleFilterChange} />
                                            </Box>
                                        </FormField>
                                      {selectedFilter === 'custom' && (
                                        <Box display="flex" gap="2" flexDirection='row' marginTop="4">

                                            <Popover content={calendarFrom} padding="none" arrow={false}>
                                                <Input
                                                    readOnly
                                                    value={selectedDateFrom && format(selectedDateFrom, "dd-MM-yyyy")}
                                                    placeholder="Select a date"
                                                    append={<Icon color="neutral-textLow" source={<CalendarIcon />} />}
                                                    appendPosition="end"
                                                />
                                            </Popover>
                                            <Popover content={calendarTo} padding="none" arrow={false}>
                                                <Input
                                                    readOnly
                                                    value={selectedDateTo && format(selectedDateTo, "dd-MM-yyyy")}
                                                    placeholder="Select a date"
                                                    append={<Icon color="neutral-textLow" source={<CalendarIcon />} />}
                                                    appendPosition="end"
                                                />
                                            </Popover>
                                        </Box>
                                      )}
                                        <Box
                                            display="flex"
                                            justifyContent="flex-end"
                                            gap="2"
                                            marginTop="4"
                                        >
                                            <Button onClick={toggleOpen} appearance="neutral">
                                                {t('settings.cancel')}
                                            </Button>
                                            <Button
                                                type="submit"
                                                appearance="primary"
                                            >
                                                {t('statistics.filter')}
                                            </Button>
                                        </Box>
                                    </Layout.Section>
                                </Layout>
                            </form>
                        </Layout.Section>
                    </Layout>
                </Sidebar.Body>
            </Sidebar>
        </>
    );
};

export default StatisticsFilterForm;
