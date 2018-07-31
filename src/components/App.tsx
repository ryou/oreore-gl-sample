import * as React from 'react';
import { Range } from './Range';
import { Select } from './Select';

import { OreOreWebGL, CameraManager, Vector3, SubstanceTemplate, MouseDrag, MouseButton } from 'oreore-gl-library';

interface AppProps {}
interface AppStates {
    color: {
        r: number;
        g: number;
        b: number;
    };
    mainTex: string;
    skybox: string;
    metallic: number;
    normalMagnification: number;
    isReady: boolean;
}

export class App extends React.Component<AppProps, AppStates> {
    protected _template: SubstanceTemplate;
    protected _skyboxTemplate: SubstanceTemplate;

    constructor(props: AppProps) {
        super(props);

        this.state = {
            color: {
                r: 1.0,
                g: 1.0,
                b: 1.0,
            },
            mainTex: 'Tiles',
            skybox: 'Chapel',
            metallic: 0.0,
            normalMagnification: 1.0,
            isReady: false,
        };

        const cameraManagerInstance = CameraManager.instance;

        const canvas = document.createElement('canvas');
        canvas.width = 1000;
        canvas.height = 1000;
        document.body.appendChild(canvas);
        
        const loadShaderData = fetch('./data/shader.json');
        const loadTextureData = fetch('./data/textures.json');
        const loadModelData = fetch('./data/models.json');
        const loadMaterialData = fetch('./data/materials.json');
        
        Promise.all([loadShaderData, loadTextureData, loadModelData, loadMaterialData])
            .then((response) => Promise.all([response[0].text(), response[1].text(), response[2].text(), response[3].text()]))
            .then(data => {
                const oreore = new OreOreWebGL(
                    canvas,
                    JSON.parse(data[0]),
                    JSON.parse(data[1]),
                    JSON.parse(data[2]),
                    JSON.parse(data[3]),
                    () => {
                        const mainCamera = CameraManager.instance.create('MainCamera');
                        mainCamera.activate();
                        mainCamera.transform.position = new Vector3(0, 0, -5);
                        mainCamera.transform.rotate = new Vector3(0, 180, 0);
                
                        this._template = new SubstanceTemplate(oreore.gl, 'smoothsphere', 'standard/tiles');
                        oreore.addTemplate(this._template);
                        const substance = this._template.instantiate();
                        if (substance !== null) {
                            substance.angularVelocity = new Vector3(1, 0, 1);
                            substance.transform.position = new Vector3(0, 0, 0);
                            substance.transform.rotate = new Vector3(0, 0, 45);
                            substance.transform.scale = new Vector3(2, 2, 2);
                        }

                        this._skyboxTemplate = new SubstanceTemplate(oreore.gl, 'skybox', 'skybox');
                        oreore.addTemplate(this._skyboxTemplate);
                        this._skyboxTemplate.instantiate();
                
                        const leftMouseDrag = new MouseDrag(canvas, MouseButton.LEFT);
                        leftMouseDrag.onDrag = (x, y) => {
                            const magnification = 0.5;
                            const addAngle = x * magnification;
                            mainCamera.transform.addRotation(0, addAngle, 0);
                            const currentAngle = mainCamera.transform.rotate.y;
                            const currentRad = (currentAngle / 180.0) * Math.PI;
                            mainCamera.transform.position = new Vector3(5 * Math.sin(currentRad), 0, 5 * Math.cos(currentRad));
                        };

                        oreore.play();
                        this.setState({isReady: true});
                    },
                );
            });
        
        const updateAspectRatio = () => {
            cameraManagerInstance.aspect = window.innerWidth / window.innerHeight;
        }
        
        window.addEventListener('load', updateAspectRatio);
        window.addEventListener('resize', updateAspectRatio);
    }

    setColor(r: number, g: number, b: number) {
        this.setState({
            color: {
                r: r,
                g: g,
                b: b,
            },
        });
        this._template.material.setOption('color', [r, g, b, 1.0]);
    }
    
    setMainTex(name: string) {
        this.setState({ mainTex: name });
        this._template.material.setOption('mainTexture', `${name}/Color`);
        this._template.material.setOption('normalTexture', `${name}/Normal`);
        this._template.material.setOption('aoTexture', `${name}/AO`);
    }

    setSkybox(name: string) {
        this.setState({ skybox: name });
        this._template.material.setOption('cubemapTexture', `Cubemap/${name}`);
        this._skyboxTemplate.material.setOption('cubemapTexture', `Cubemap/${name}`);
    }

    setMetallic(value: number) {
        this.setState({ metallic: value });
        this._template.material.setOption('metallic', value);
    }

    setNormalMagnification(value: number) {
        this.setState({ normalMagnification: value });
        this._template.material.setOption('normalMagnification', value);
    }

    render() {
        return (
            <div
                className={ (this.state.isReady) ? '' : '-hidden' }
            >
                <table>
                    <tbody>
                        <tr>
                            <th>カラー</th>
                            <td>
                                <Range
                                    value={this.state.color.r}
                                    onChange={(value) => { this.setColor(value, this.state.color.g, this.state.color.b) }}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                /><br />
                                <Range
                                    value={this.state.color.g}
                                    onChange={(value) => { this.setColor(this.state.color.r, value, this.state.color.b) }}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                /><br />
                                <Range
                                    value={this.state.color.b}
                                    onChange={(value) => { this.setColor(this.state.color.r, this.state.color.g, value) }}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>テクスチャ</th>
                            <td>
                                <Select
                                    value={this.state.mainTex}
                                    items={['PavingStones', 'Tiles', 'Metal', 'Leather', 'Marble']}
                                    onChange={(value) => { this.setMainTex(value) }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Skybox</th>
                            <td>
                                <Select
                                    value={this.state.skybox}
                                    items={['Yokohama', 'Chapel', 'Cloud']}
                                    onChange={(value) => { this.setSkybox(value) }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>金属質</th>
                            <td>
                                <Range
                                    value={this.state.metallic}
                                    onChange={(value) => { this.setMetallic(value) }}
                                    min={0}
                                    max={1}
                                    step={0.01}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>法線</th>
                            <td>
                                <Range
                                    value={this.state.normalMagnification}
                                    onChange={(value) => { this.setNormalMagnification(value) }}
                                    min={0.00001}
                                    max={3}
                                    step={0.01}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
