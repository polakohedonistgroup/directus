<template>
	<v-menu ref="dateTimeMenu" :close-on-content-click="false" attached :disabled="disabled" full-height seamless>
		<template #activator="{ toggle, active }">
			<v-input
				:active="active"
				clickable
				readonly
				:model-value="displayValue"
				:disabled="disabled"
				:placeholder="!isValidValue ? value : t('enter_a_value')"
				:suffix="t('hours')"
				@click="toggle"
			>
				<template v-if="!disabled" #append>
					<v-icon
						:name="value !== null ? 'clear' : 'today'"
						:class="{ active, 'clear-icon': value !== null, 'today-icon': value === null }"
						v-on="{ click: value !== null ? unsetValue : null }"
					/>
				</template>
			</v-input>
		</template>

		<v-date-picker
			:type="'time'"
			:disabled="disabled"
			:include-seconds="false"
			:use-24="true"
			:display-set-to-now="false"
			:display-done="true"
			:model-value="pickerValue"
			@update:model-value="updateValue($event)"
			@close="dateTimeMenu?.deactivate"
		/>
	</v-menu>
</template>

<script setup lang="ts">
import { localizedFormat } from '@/utils/localized-format';
import { isValid } from 'date-fns';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
	defineProps<{
		value: number | null;
		disabled?: boolean;
	}>(),
	{}
);

const emit = defineEmits<{ (e: 'input', value: number | null): void }>();

const { t } = useI18n();

const dateTimeMenu = ref();

const { displayValue, isValidValue } = useDisplayValue();

function useDisplayValue() {
	const displayValue = ref<string | null>(null);

	const isValidValue = computed(() => isValid(parseProps(props.value)));

	watch(() => props.value, setDisplayValue, { immediate: true });

	return { displayValue, isValidValue };

	function setDisplayValue() {
		if (!props.value || !isValidValue.value) {
			displayValue.value = null;
			return;
		}

		const format = String(t('date-fns_time_no_seconds_24hour'));

		displayValue.value = localizedFormat(parseProps(props.value), format);
	}
}

const pickerValue = computed(() => parseProps(props.value));

function parseProps(value: number | null): Date {
	const reference = new Date();
	reference.setHours(0, 0, 0, 0);
	if (!value) return reference;
	const minutes = value % 60;
	const hours = (value - minutes) / 60;
	reference.setHours(hours, minutes);
	return reference;
}

function updateValue(value: string | null) {
	const parts = value?.split(':');
	const hours = +(parts?.[0] || 0) * 60;
	const minutes = +(parts?.[1] || 0);
	emit('input', hours + minutes);
}

function unsetValue(e: any) {
	e.preventDefault();
	e.stopPropagation();
	emit('input', null);
}
</script>

<style lang="scss" scoped>
.v-icon {
	&.today-icon {
		&:hover,
		&.active {
			--v-icon-color: var(--primary);
		}
	}

	&.clear-icon {
		&:hover,
		&.active {
			--v-icon-color: var(--danger);
		}
	}
}
</style>
