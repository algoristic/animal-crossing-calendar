import Panel from './Panel'

export default ({ animals, month, hour }) => {
    return (
        <Panel text='Insekten' icon='🐛'
            animals={animals.get('insekten', month, hour)}>
        </Panel>
    );
}
